import type { MockMethod } from 'vite-plugin-mock';

export default [
    {
      url: '/api/system_setting/get_system_setting/',
      method: 'get',
      response: () => {
        return {
            samplingInterval:30000,
        }
      },
    },
  ] as MockMethod[];