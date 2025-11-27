import { ref, onMounted } from 'vue';
import { useMonitoringStore } from '@/pinia/monitoringStore';
import { useChartStore } from '@/pinia/chartStore';
import { useChannelValuesStore } from '@/pinia/channelValuesStore';
import { useWebSocket } from './useWebSocket';
import { DeviceHealthEnum } from '@/uniqueComponents/DeviceHealthEnum';
import { useTrendStore } from '@/pinia/trendStore';

export function useAppInitializer() {
  const isLoading = ref(true);
  const monitoringStore = useMonitoringStore();
  const chartStore = useChartStore();
  const channelValuesStore = useChannelValuesStore();
  const trendStore = useTrendStore();
  const { connect } = useWebSocket();

  onMounted(async () => {
    // ストア初期化と5秒待機の両方が完了するのを待つ
    await Promise.all([
      monitoringStore.initialize(),
      chartStore.initialize(),
      new Promise(resolve => setTimeout(resolve, 2500))
    ]);

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
  });

  return { isLoading };
}
