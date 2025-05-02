import type { MockMethod } from 'vite-plugin-mock';
import { ChartTypes} from '@monitoring/shared/enum';    
import { createChartForInitialization } from '@monitoring/shared/model';

export default [
    {
      url: '/api/chart/get_dashboard_charts/',
      method: 'get',
      response: () => [
        createChartForInitialization(0,ChartTypes.GaugeChart),
        createChartForInitialization(1,ChartTypes.GaugeChart),
      ]
    },
  ] as MockMethod[];