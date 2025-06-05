
function formatTime(value: string) {
  const sourceDate = new Date(value);
  const hours = sourceDate.getHours().toString().padStart(2, '0');
  const minutes = sourceDate.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
  
}

function processData(data: any) {
  const processedData = [];
  const maxIntervalMs = 1 * 60 * 1000; // 1分をミリ秒に変換
  for (let i = 0; i < data.length; i++) {
    processedData.push([data[i].timestamp, data[i].value]);
    if (i < data.length - 1) {
      const prevTime = new Date(data[i].timestamp).getTime();
      const currentTime = new Date(data[i + 1].timestamp).getTime();
      if (currentTime - prevTime > maxIntervalMs) {
        processedData.push([data[i].timestamp, null]);
        processedData.push([data[i + 1].timestamp, null]);
      }
    }
  }
  return processedData;
}
// Start of Selection

export function getDefaultTrendLineChartOptions() {
  
  const options = {
    animation: true,
    grid: { top: 40, left: 10, right: 25, containLabel: true },
    toolbox: {
      feature: { dataZoom: { yAxisIndex: 'none' }, restore: {}, saveAsImage: {} }
    },
    
    xAxis: {
      type: 'time',
      boundaryGap: false,
      axisLabel: { formatter: formatTime }
    },
    yAxis: { type: 'value' },
    dataZoom: [
      { type: 'inside', start: 0, end: 100 },
      { start: 0, end: 100 }
    ],
    series: [{
      name: 'Sensor Data',
      data: [],
      type: 'line',
      symbol: 'none',
      sampling: 'lttb',
    }]
  };
  return options;
};

export function getTrendLineChartOptions(inputData: any,minThreshold: number,maxThreshold: number) {
  const processedData = processData(inputData);
  const options = {
    animation: false,
    grid: { top: 40, left: 10, right: 25, containLabel: true },
    toolbox: {
      feature: { dataZoom: { yAxisIndex: 'none' }, restore: {}, saveAsImage: {} }
    },
    visualMap: {
      show: false,
      pieces: [
        {lte: minThreshold, color: '#FD0100' },
        //{ gt: 1.5, lte: 3, color: '#FBDB0F' },
        { gt: minThreshold, lte: maxThreshold, color: '#3cb371' },
        { gt: maxThreshold, color: '#FD0100' }
      ],
      outOfRange: { color: '#999' }
    },
    xAxis: {
      type: 'time',
      boundaryGap: false,
      axisLabel: { formatter: formatTime }
    },
    yAxis: { type: 'value' },
    dataZoom: [
      { type: 'inside', start: 0, end: 100 },
      { start: 0, end: 100 }
    ],
    series: [{
      name: 'Sensor Data',
      data: processedData,
      type: 'line',
      symbol: 'none',
      sampling: 'lttb',
      progressive: 2000, // 1フレーム当たり描画するポイント数
      progressiveThreshold: 3000, // プログレッシブレンダリングを有効化する閾値
      emphasis: {
        disabled: true, // マウスオーバー時の強調を無効にする
                focus: 'none', // デフォルトのフォーカス効果を無効化
    },
      markLine: {
        silent: true,
        lineStyle: { color: 'red' },
        data: [{ yAxis: minThreshold }, { yAxis: maxThreshold }]
      }
    }]
  };
  return options;
};
