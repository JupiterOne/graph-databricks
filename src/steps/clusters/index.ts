import {
  createDirectRelationship,
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from '../../client';

import { IntegrationConfig } from '../../config';
import { Steps, Entities, Relationships } from '../constants';
import { getUserKey } from '../groups/converters';
import { WORKSPACE_ENTITY_KEY } from '../workspace';
import { createClusterEntity } from './converters';

export async function fetchClusters({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  const workspaceEntity = (await jobState.getData(
    WORKSPACE_ENTITY_KEY,
  )) as Entity;

  await apiClient.iterateClusters(async (cluster) => {
    const clusterEntity = await jobState.addEntity(
      createClusterEntity(cluster),
    );

    await jobState.addRelationship(
      createDirectRelationship({
        _class: RelationshipClass.HAS,
        from: workspaceEntity,
        to: clusterEntity,
      }),
    );
  });
}

export async function buildClusterUserRelationships({
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  await jobState.iterateEntities(
    { _type: Entities.CLUSTER._type },
    async (clusterEntity) => {
      const userEntity = await jobState.findEntity(
        getUserKey(clusterEntity.creator as string),
      );
      if (userEntity) {
        await jobState.addRelationship(
          createDirectRelationship({
            _class: RelationshipClass.CREATED,
            from: userEntity,
            to: clusterEntity,
          }),
        );
      }
    },
  );
}

export const clusterSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.CLUSTERS,
    name: 'Fetch Clusters',
    entities: [Entities.CLUSTER],
    relationships: [Relationships.WORKSPACE_HAS_CLUSTER],
    dependsOn: [Steps.WORKSPACE],
    executionHandler: fetchClusters,
  },
  {
    id: Steps.CLUSTER_USER_RELATIONSHIPS,
    name: 'Build Cluster User Relationships',
    entities: [],
    relationships: [Relationships.USER_CREATED_CLUSTER],
    dependsOn: [Steps.GROUP_USERS, Steps.CLUSTERS],
    executionHandler: buildClusterUserRelationships,
  },
];
