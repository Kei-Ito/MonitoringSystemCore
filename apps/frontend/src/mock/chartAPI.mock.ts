import type { MockMethod } from 'vite-plugin-mock';
import { ChartTypes } from '@monitoring/shared/enum';
import { createChartForInitialization } from '@monitoring/shared/model';

function defaultChart() {
  
  const chart1 = createChartForInitialization(ChartTypes.GaugeChart);
  chart1.grid_layout.h = 8;
  chart1.chart_title = 'super special very very long text';
  chart1.chart_unit = 'W/cm2';
  chart1.channel_uuids = ['channel_mock_uuid0', 'channel_mock_uuid1'];
  const chart2 = createChartForInitialization(ChartTypes.GaugeChart);
  chart2.grid_layout = {
    ...chart2.grid_layout,
    h: 8,
    x: 4,

  }
  chart2.chart_title = 'very very very long text';
  chart2.chart_unit = 'W/cm2';
  const chart3 = createChartForInitialization(ChartTypes.GaugeChart);
  chart3.chart_title = '流量';
  chart3.chart_unit = 'L/min';
  chart3.grid_layout = {
    ...chart3.grid_layout,
    h: 8,
    x: 8,
  }
  const chart4 = createChartForInitialization(ChartTypes.GaugeChart);
  chart4.chart_title = '照度';
  chart4.chart_unit = 'mW/cm2';
  chart4.grid_layout = {
    ...chart4.grid_layout,
    h: 8,
    x: 0,
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