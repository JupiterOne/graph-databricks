import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import { Steps, Entities } from '../constants';
import { createWorkspaceEntity } from './converters';

export const WORKSPACE_ENTITY_KEY = 'entity:workspace';

export async function fetchWorkspaceDetails({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const workspaceHost = instance.config.databricksHost;
  const workspaceEntity = await jobState.addEntity(
    createWorkspaceEntity(workspaceHost),
  );

  await jobState.setData(WORKSPACE_ENTITY_KEY, workspaceEntity);
}

export const workspaceSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.WORKSPACE,
    name: 'Fetch Workspace Details',
    entities: [Entities.WORKSPACE],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchWorkspaceDetails,
  },
];
