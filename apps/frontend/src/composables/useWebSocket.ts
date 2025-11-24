import { onUnmounted } from 'vue';
import { useToast } from "vue-toastification";
import { useMonitoringStore } from '@/pinia/monitoringStore';
import { useChannelValuesStore } from '@/pinia/channelValuesStore';
import { DeviceHealthEnum } from '@/uniqueComponents/DeviceHealthEnum';
import type { getIOModuleInputResponse } from "@monitoring/shared/api";

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
