import { IOModuleStatus, IOModuleTypes } from '@monitoring/shared/enum';
import { createModuleForInitialization } from '@monitoring/shared/model';
import type { MockMethod } from 'vite-plugin-mock';

import { CHANNEL_UUIDS, computeChannelValue } from './channelMockData';

const defaultModule = createModuleForInitialization("module1",'module1',IOModuleTypes.Dummy);
for (let i = 0; i < defaultModule.input_channel_num; i++) {
  const channelUuid = CHANNEL_UUIDS[i] ?? `channel_mock_uuid${i}`;
  defaultModule.input_channels[i] = {
    ...defaultModule.input_channels[i],
    channel_uuid: channelUuid,
    channel_name: `channel_mock_name${i}`,
  }
}

function createRuntimeSnapshot() {
  const now = Date.now();
  return {
    module_uuid: defaultModule.module_uuid,
    timestamp: new Date(now).toISOString(),
    channels: defaultModule.input_channels.map((channel) => ({
      channel_uuid: channel.channel_uuid,
      input_data: computeChannelValue(channel.channel_uuid, now),
    })),
  };
}

let isSampling = false;

function buildStatusResponse() {
  return [
    {
      module_uuid: defaultModule.module_uuid,
      status: isSampling ? IOModuleStatus.Active : IOModuleStatus.Inactive,
    },
  ];
}

export default [
  {
    url: '/api/io_module/current/',
    method: 'get',
    response: () => ({
      input_datas: [createRuntimeSnapshot()],
    }),
  },
  {
    url: '/api/io_module/start/',
    method: 'post',
    response: () => {
      isSampling = true;
      return buildStatusResponse();
    },
  },
  {
    url: '/api/io_module/stop/',
    method: 'post',
    response: () => {
      isSampling = false;
      return null;
    },
  },
  {
    url: '/api/io_module/get_io_modules/',
    method: 'get',
    response: () => [
      defaultModule
    ],
  },
] as MockMethod[];