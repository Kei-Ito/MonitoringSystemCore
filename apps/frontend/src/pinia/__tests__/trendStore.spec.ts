import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { useTrendStore } from '../trendStore'
import { useChannelValuesStore } from '../channelValuesStore'

// モックの定義
vi.mock('@/service/trendDataService', () => ({
  getTrendData: vi.fn().mockResolvedValue(undefined)
}))

// useChartStoreのモック (trendStore内で使用されているため)
vi.mock('../chartStore', () => ({
  useChartStore: vi.fn(() => ({
    trendCharts: {}
  }))
}))

describe('trendStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    // システム時間を固定 (2025-11-24 10:00:00)
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2025, 10, 24, 10, 0, 0))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('初期状態が正しいこと', () => {
    const store = useTrendStore()
    expect(store.isRealtimeMode).toBe(true)
    
    // 初期日付は当日になっているはず
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
    
    expect(store.selectedDateRange.startDate.getTime()).toBe(todayStart.getTime())
    expect(store.selectedDateRange.endDate.getTime()).toBe(todayEnd.getTime())
  })

  it('setTrendConditionでモードと日付が更新されること', () => {
    const store = useTrendStore()
    const startDate = new Date(2025, 10, 20)
    const endDate = new Date(2025, 10, 21)
    
    store.setTrendCondition(false, { startDate, endDate })
    
    expect(store.isRealtimeMode).toBe(false)
    expect(store.selectedDateRange.startDate).toEqual(startDate)
    expect(store.selectedDateRange.endDate).toEqual(endDate)
  })

  describe('checkDateChange', () => {
    it('リアルタイムモードでない場合は何もしないこと', () => {
      const store = useTrendStore()
      const channelValuesStore = useChannelValuesStore()
      const clearSpy = vi.spyOn(channelValuesStore, 'clearAllTimeSeries')
      
      // 過去モードに設定
      store.setTrendCondition(false, { 
        startDate: new Date(2025, 10, 20), 
        endDate: new Date(2025, 10, 20) 
      })
      
      // 日付を進める (翌日へ)
      vi.setSystemTime(new Date(2025, 10, 25, 10, 0, 0))
      
      store.checkDateChange()
      
      // クリア処理が呼ばれていないこと
      expect(clearSpy).not.toHaveBeenCalled()
    })

    it('リアルタイムモードで日付が変わっていない場合は何もしないこと', () => {
      const store = useTrendStore()
      const channelValuesStore = useChannelValuesStore()
      const clearSpy = vi.spyOn(channelValuesStore, 'clearAllTimeSeries')
      
      // リアルタイムモード (初期状態)
      
      // 時間を進めるが日付は変わらない (同日 23:59:59)
      vi.setSystemTime(new Date(2025, 10, 24, 23, 59, 59))
      
      store.checkDateChange()
      
      expect(clearSpy).not.toHaveBeenCalled()
    })

    it('リアルタイムモードで日付が変わった場合にデータがクリアされ日付が更新されること', async () => {
      const store = useTrendStore()
      const channelValuesStore = useChannelValuesStore()
      const clearSpy = vi.spyOn(channelValuesStore, 'clearAllTimeSeries')
      const fetchSpy = vi.spyOn(store, 'fetchAllTrendData')
      
      // リアルタイムモード (初期状態: 11/24)
      
      // 日付を進める (翌日 11/25 00:00:01)
      vi.setSystemTime(new Date(2025, 10, 25, 0, 0, 1))
      
      store.checkDateChange()
      
      // データクリアが呼ばれたこと
      expect(clearSpy).toHaveBeenCalled()
      
      // 日付が更新されたこと
      const newStart = new Date(2025, 10, 25, 0, 0, 0)
      const newEnd = new Date(2025, 10, 25, 23, 59, 59)
      expect(store.selectedDateRange.startDate.getTime()).toBe(newStart.getTime())
      expect(store.selectedDateRange.endDate.getTime()).toBe(newEnd.getTime())
      
      // データ再取得が呼ばれたこと
      expect(fetchSpy).toHaveBeenCalled()
    })
  })
})
