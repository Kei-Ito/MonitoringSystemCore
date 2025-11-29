import { ref, onMounted } from 'vue';
import { useMonitoringStore } from '@/pinia/monitoringStore';
import { useChartStore } from '@/pinia/chartStore';
import { useChannelValuesStore } from '@/pinia/channelValuesStore';
import { useWebSocket } from './useWebSocket';
import { DeviceHealthEnum } from '@/uniqueComponents/DeviceHealthEnum';
import { useTrendStore } from '@/pinia/trendStore';

export function useAppInitializer() {
  const isLoading = ref(true);
  const isError = ref(false);
  const monitoringStore = useMonitoringStore();
  const chartStore = useChartStore();
  const channelValuesStore = useChannelValuesStore();
  const trendStore = useTrendStore();
  const { connect } = useWebSocket();

  const initialize = async () => {
    isLoading.value = true;
    isError.value = false;

    try {
      // ストア初期化と2.5秒待機の両方が完了するのを待つ
      const [monitoringResult, chartResult] = await Promise.all([
        monitoringStore.initialize(),
        chartStore.initialize(),
        new Promise(resolve => setTimeout(resolve, 2500))
      ]);

      // 初期化失敗チェック
      if (monitoringResult && !monitoringResult.ok) {
        throw new Error(`Monitoring Store Initialization Failed: ${monitoringResult.error.message}`);
      }
      if (chartResult && !chartResult.ok) {
        throw new Error(`Chart Store Initialization Failed: ${chartResult.error.message}`);
      }

      // トレンドデータの初期読み込み（非同期で実行）
      trendStore.fetchAllTrendData();

      // デバイス健康状態を初期化
      channelValuesStore.initializeDeviceHealth([
        { name: "照射炉1", status: DeviceHealthEnum.Unknown },
        { name: "照射炉2", status: DeviceHealthEnum.Unknown },
        { name: "照射炉3", status: DeviceHealthEnum.Unknown },
      ]);

      // WebSocket接続開始
      connect();

      isLoading.value = false;
    } catch (error) {
      console.error("Initialization failed:", error);
      isError.value = true;
      // エラー時はisLoadingをtrueのままにしておくことで、スプラッシュ画面を維持する
    }
  };

  onMounted(async () => {
    // オフラインでなければ初期化を実行
    if (navigator.onLine) {
      await initialize();
    }
  });

  return { isLoading, isError, initialize };
}
