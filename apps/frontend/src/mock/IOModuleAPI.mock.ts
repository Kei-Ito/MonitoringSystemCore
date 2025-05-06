import type { MockMethod } from 'vite-plugin-mock';
import { IOModuleTypes } from '@monitoring/shared/enum';
import { createModuleForInitialization } from '@monitoring/shared/model';

const defaultModule = createModuleForInitialization("module1",'module1',IOModuleTypes.Dummy);
for (let i = 0; i < defaultModule.input_channel_num; i++) {
  defaultModule.input_channels[i] = {
    ...defaultModule.input_channels[i],
    channel_uuid: `channel_mock_uuid${i}`,
    channel_name: `channel_mock_name${i}`,
  }
}

export default [
  {
    url: '/api/io_module/get_io_modules/',
    method: 'get',
    response: () => [
      defaultModule
    ],
  },
] as MockMethod[];