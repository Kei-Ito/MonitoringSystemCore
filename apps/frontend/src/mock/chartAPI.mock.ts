import type { MockMethod } from 'vite-plugin-mock';
import { ChartTypes } from '@monitoring/shared/enum';
import { createChartForInitialization, type ChartConfig } from '@monitoring/shared/model';

function defaultChart() {


  const chartList:ChartConfig[] = []
  const chart1 = createChartForInitialization(ChartTypes.HorizontalBarChart);
  chart1.grid_layout.h = 8;
  chart1.category1 = '照射炉1';
  chart1.category2 = '液温';
  chart1.chart_title = 'super special very very long text';
  chart1.chart_unit = 'W/cm2';
  chart1.channel_uuids = ['channel_mock_uuid0', 'channel_mock_uuid1', 'channel_mock_uuid2', 'channel_mock_uuid3', 'channel_mock_uuid4', 'channel_mock_uuid5', 'channel_mock_uuid6', 'channel_mock_uuid7', 'channel_mock_uuid8'];
  chart1.grid_layout = {
    ...chart1.grid_layout,
    h: 8,
    w: 12,
    x: 0,
    y: 0,
  }

  const chart2 = createChartForInitialization(ChartTypes.HorizontalBarChart);
  chart2.grid_layout.h = 8;
  chart2.category1 = '照射炉1';
  chart2.category2 = '液温';
  chart2.chart_title = 'super special very very long text';
  chart2.chart_unit = 'W/cm2';
  chart2.channel_uuids = ['channel_mock_uuid0', 'channel_mock_uuid1', 'channel_mock_uuid2', 'channel_mock_uuid3', 'channel_mock_uuid4', 'channel_mock_uuid5', 'channel_mock_uuid6', 'channel_mock_uuid7', 'channel_mock_uuid8'];
  chart2.grid_layout = {
    ...chart2.grid_layout,
    h: 8,
    w: 12,
    x: 0,
    y: 0,
  }
  

  const category2List = ['液温','UV強度','炉内温度','ランプ電圧','ランプ電流','安定器電流','冷却ファン周波数',null]; 
  chartList.push(chart1);
  chartList.push(chart2);
  for ( let i = 0; i < 8; i++) {
    let chart = createChartForInitialization(ChartTypes.GaugeChart);
    chart = {
      ...chart,
      chart_title: `title ${i}`,
      chart_unit : 'unit',
      channel_uuids:[`channel_mock_uuid${i}`],
      category1: '照射炉1',
      category2: category2List[i],
      grid_layout: {
        ...chart.grid_layout,
        h: 8,
        w: 4,
        x: (i % 4) * 4,
        y: Math.floor(i / 4) * 8,
      }
    }
    chartList.push(chart);
  }
  

  return chartList;
}


export default [
  {
    url: '/api/chart/get_dashboard_charts/',
    method: 'get',
    response: () => defaultChart(),
  },
] as MockMethod[];