フロントエンドでは、状態管理storeとしてPiniaを使用している。
# chartStore
アプリのUIレイアウトの状態管理を行うStore
- uiLayouts
	UIレイアウトの
- dashboardCharts
- trendCharts

# monitoringStore
アプリのIOモジュールや設定値の状態管理を行うStore
- ioModules
- isSampling
- samplingInterval
- dataRootPath

# channelValuesStore
IOモジュールのチャンネルごとにランタイム値や時系列データを保持するStore
- 