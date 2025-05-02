import type { MockMethod } from 'vite-plugin-mock';
import { IOModuleTypes } from '@monitoring/shared/enum';
import { createModuleForInitialization } from '@monitoring/shared/model';

export default [
  {
    url: '/api/io_module/get_io_modules/',
    method: 'get',
    response: () => [
      createModuleForInitialization('1', 'Module1', IOModuleTypes.Dummy),
    ],
  },
] as MockMethod[];