import type { RuntimeValue } from "@monitoring/shared/model";
import type { MockMethod } from 'vite-plugin-mock';

function getDummyTimeSeries(){
    const dummyTimeSeries:RuntimeValue[] = []
    for (let i = 0; i < 100; i++) (
        dummyTimeSeries.push({
        timestamp: new Date(Date.now() + i * 1000),
        value: Math.floor(Math.random() * 100)
        })
    )
    return dummyTimeSeries;
}   

export default [
  {
    url: '/api/trend_data/',
    method: 'get',
    response: () => {
      const trend = getDummyTimeSeries();
      return trend;
    },
  },
] as MockMethod[];