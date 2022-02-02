import { IntegrationSpecConfig } from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../../src/config';
import { clusterSpec } from './clusters';
import { workspaceSpec } from './workspace';
import { groupSpec } from './groups';

export const invocationConfig: IntegrationSpecConfig<IntegrationConfig> = {
  integrationSteps: [...workspaceSpec, ...groupSpec, ...clusterSpec],
};
