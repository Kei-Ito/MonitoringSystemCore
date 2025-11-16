フロントエンドでは、状態管理storeとしてPiniaを使用している。
# monitoringStore
アプリのIOモジュールや設定値の状態管理を行うStore。
- ioModules
- isSampling
- samplingInterval
- dataRootPath
# chartStore
アプリのUIレイアウトの状態管理を行うStore。
- uiLayouts
	UIレイアウトの
- dashboardCharts
- trendCharts
# channelValuesStore
IOモジュールのチャンネルごとにランタイム値や時系列データを保持するStore。
更新はApp.vueの管理するWebSocketからactionを通じて行う。
- channelValues
	チャンネルUUIDごとにruntimeValueとtimeSeriesを保持する
- deviceHealthStatuses
	照射炉毎のヘルス状態を保持
# useSeries
chartStoreとchannelValuesStoreの状態をUIから使いやすい形に整形して渡す役割。
chart_uuidを渡すとそのChartで使う設定値(ChartConfig)とデータ(channelValue)を返す。
