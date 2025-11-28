import { onUnmounted, ref } from 'vue';
import { useToast } from "vue-toastification";
import { useMonitoringStore } from '@/pinia/monitoringStore';
import { useChannelValuesStore } from '@/pinia/channelValuesStore';
import { DeviceHealthEnum } from '@/uniqueComponents/DeviceHealthEnum';
import type { getIOModuleInputResponse } from "@monitoring/shared/api";
import { getHealthCheck } from '@/api';

// グローバルなドライブマウント警告状態
export const showDriveMountWarning = ref(false);
export const driveMountPath = ref('');

export function useWebSocket() {
  const toast = useToast();
  const monitoringStore = useMonitoringStore();
  const channelValuesStore = useChannelValuesStore();

  let socket: WebSocket | null = null;
  let retryTimer: ReturnType<typeof setTimeout> | null = null;

  function updateRuntimeValues(module_datas: getIOModuleInputResponse[]) {
    module_datas.map((module_data) => {
      module_data.channels.map((channel) => {
        channelValuesStore.setRuntimeValue(channel.channel_uuid, channel.input_data);
      });
    });
  }

  async function performHealthCheck() {
    try {
      const healthResult = await getHealthCheck();
      if (healthResult.ok) {
        const healthData = healthResult.value.data;
        
        if (!healthData.drivesMounted) {
          showDriveMountWarning.value = true;////////ここをtrueに変更////////
          driveMountPath.value = healthData.dataRootPath;
          
          toast.error(
            `データ保存用ドライブがマウントされていません`,
            { timeout: false }
          );
        } else {
          // ドライブが正常にマウントされている場合、警告を解除
          if (showDriveMountWarning.value) {
            showDriveMountWarning.value = false;
            toast.success('ドライブが正常にマウントされました');
          }
          console.log('✓ Drive mounted:', healthData.dataRootPath);
        }
      } else {
        console.error('Health check failed:', healthResult.error);
      }
    } catch (error) {
      console.error('Health check error:', error);
    }
  }

  function connect() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.hostname;
    const endpoint = `${protocol}//${host}:2479/ws`;

    function createWebSocket() {
      const ws = new WebSocket(endpoint);

      ws.onopen = () => {
        if (retryTimer) {
          clearTimeout(retryTimer);
          retryTimer = null;
        }
        
        // WebSocket接続時にヘルスチェックを実行
        performHealthCheck();
      };

      ws.onmessage = (event: MessageEvent) => {
        const message = JSON.parse(event.data);
        switch (message.type) {
          case "IOModuleData":
            updateRuntimeValues(message.data);
            if (monitoringStore.isSampling) {
              if (message.deviceStatuses) {
                for (const [deviceName, status] of Object.entries(message.deviceStatuses)) {
                  const deviceStatus = typeof status === 'string'
                    ? DeviceHealthEnum[status as keyof typeof DeviceHealthEnum]
                    : status as DeviceHealthEnum;
                  channelValuesStore.setDeviceHealth(deviceName, deviceStatus);
                }
              } else {
                const deviceStatus = typeof message.status === 'string'
                  ? DeviceHealthEnum[message.status as keyof typeof DeviceHealthEnum]
                  : message.status;
                channelValuesStore.setDeviceHealth("照射炉1", deviceStatus);
              }
            }
            break;
          case "StartSampling":
            monitoringStore.isSampling = true;
            toast.success("モニタリングを開始しました");
            break;
          case "StopSampling":
            monitoringStore.isSampling = false;
            toast.success("モニタリングを停止しました");
            channelValuesStore.setDeviceHealth("照射炉1", DeviceHealthEnum.Unknown);
            channelValuesStore.setDeviceHealth("照射炉2", DeviceHealthEnum.Unknown);
            channelValuesStore.setDeviceHealth("照射炉3", DeviceHealthEnum.Unknown);
            break;
          case "SamplingError":
            monitoringStore.isSampling = false;
            const errorMsg = message.message || "サンプリング中にエラーが発生しました";
            const errors = message.errors || [];
            
            // エラーメッセージを表示
            toast.error(errorMsg, { timeout: false });
            
            // 詳細エラーをコンソールに出力
            if (errors.length > 0) {
              console.error("サンプリングエラー詳細:", errors);
            }
            
            // デバイス健康状態をUnknownに設定
            channelValuesStore.setDeviceHealth("照射炉1", DeviceHealthEnum.Unknown);
            channelValuesStore.setDeviceHealth("照射炉2", DeviceHealthEnum.Unknown);
            channelValuesStore.setDeviceHealth("照射炉3", DeviceHealthEnum.Unknown);
            
            // ドライブマウント警告を表示
            showDriveMountWarning.value = true;
            
            // ヘルスチェックを実行して状態を更新
            performHealthCheck();
            break;
          case "samplingStatus":
            monitoringStore.isSampling = message.data;
            break;
          default:
            console.error("Unknown message type:", message.type);
        }
      };

      /** WebSocketが閉じられたときの処理 */
      ws.onclose = () => {
        console.log("WebSocket connection closed");
        monitoringStore.isSampling = false;

        // 全デバイスの健康状態をUnknownに設定
        channelValuesStore.setDeviceHealth("照射炉1", DeviceHealthEnum.Unknown);
        channelValuesStore.setDeviceHealth("照射炉2", DeviceHealthEnum.Unknown);
        channelValuesStore.setDeviceHealth("照射炉3", DeviceHealthEnum.Unknown);

        // 5秒後に再接続を試みる
        if (!retryTimer) {
          retryTimer = setTimeout(() => {
            retryTimer = null;
            socket = createWebSocket();
          }, 5000);
        }
      };

      ws.onerror = (error: Event) => {
        console.error("WebSocket error:", error);
      };
      return ws;
    }
    socket = createWebSocket();
  }

  function close() {
    if (socket !== null) {
      socket.close();
    }
    if (retryTimer) {
      clearTimeout(retryTimer);
    }
  }

  onUnmounted(() => {
    close();
  });

  return { connect, close };
}
