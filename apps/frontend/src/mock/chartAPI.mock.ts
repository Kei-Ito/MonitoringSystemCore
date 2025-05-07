import type { MockMethod } from 'vite-plugin-mock';
import { ChartTypes } from '@monitoring/shared/enum';
import { createChartForInitialization } from '@monitoring/shared/model';

function defaultChart() {
  
  const chart1 = createChartForInitialization(ChartTypes.HorizontalBarChart);
  chart1.grid_layout.h = 8;
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

  const chart2 = createChartForInitialization(ChartTypes.GaugeChart);
  chart2.grid_layout = {
    ...chart2.grid_layout,
    h: 8,
    x: 0,
    y: 8

  }
  chart2.chart_title = 'very very very long text';
  chart2.chart_unit = 'W/cm2';
  chart2.channel_uuids = ['channel_mock_uuid0', 'channel_mock_uuid1', 'channel_mock_uuid2', 'channel_mock_uuid3', 'channel_mock_uuid4', 'channel_mock_uuid5', 'channel_mock_uuid6', 'channel_mock_uuid7', 'channel_mock_uuid8'];

  const chart3 = createChartForInitialization(ChartTypes.GaugeChart);
  chart3.channel_uuids = [ 'channel_mock_uuid1' ];
  chart3.chart_title = '流量';
  chart3.chart_unit = 'L/min';
  chart3.grid_layout = {
    ...chart3.grid_layout,
    h: 8,
    x: 4,
    y:8
  }
  const chart4 = createChartForInitialization(ChartTypes.GaugeChart);
  chart4.channel_uuids = [ 'channel_mock_uuid2' ];
  chart4.chart_title = '照度';
  chart4.chart_unit = 'mW/cm2';
  chart4.grid_layout = {
    ...chart4.grid_layout,
    h: 8,
    x: 8,
    y: 8
  }

  return [
    chart1,
    chart2,
    chart3,
    chart4,
  ]
}


export default [
  {
    url: '/api/chart/get_dashboard_charts/',
    method: 'get',
    response: () => defaultChart(),
  },
] as MockMethod[];