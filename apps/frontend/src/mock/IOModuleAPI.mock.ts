import { defineMock } from 'vite-plugin-mock-dev-server';
import type { IOModule } from '@monitoring/shared/model';
import { IOModuleTypes } from '@monitoring/shared/enum';
import { createModuleForInitialization } from '@monitoring/shared/model';

export default defineMock([
    {
      url: '/api/io_module/get_io_modules/',
      method: 'GET',
      body: <IOModule[]>[
        createModuleForInitialization("1", "Module1", IOModuleTypes.Dummy),
      ],
    },
  ]);