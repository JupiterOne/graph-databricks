import {
  createDirectRelationship,
  createMappedRelationship,
  Entity,
  getRawData,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from '../../client';

import { IntegrationConfig } from '../../config';
import { DatabricksCluster } from '../../types';
import {
  Steps,
  Entities,
  Relationships,
  MappedRelationships,
  TargetEntities,
} from '../constants';
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

export async function buildClusterIsAwsInstanceRelationships({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  // "cloud" is found in the host when Databricks for AWS is used
  if (!instance.config.databricksHost.includes('.cloud.databricks.com')) {
    return;
  }

  await jobState.iterateEntities(
    { _type: Entities.CLUSTER._type },
    async (clusterEntity) => {
      const cluster = getRawData<DatabricksCluster>(clusterEntity);

      if (clusterEntity && cluster) {
        await jobState.addRelationship(
          createMappedRelationship({
            source: clusterEntity,
            _class: RelationshipClass.IS,
            _type: MappedRelationships.CLUSTER_IS_AWS_INSTANCE._type,
            _mapping: {
              sourceEntityKey: clusterEntity._key,
              relationshipDirection:
                MappedRelationships.CLUSTER_IS_AWS_INSTANCE.direction,
              targetFilterKeys: [['tag.ClusterId', '_type', '_class']],
              targetEntity: {
                _class: TargetEntities.AWS_INSTANCE._class,
                _type: TargetEntities.AWS_INSTANCE._type,
                'tag.ClusterId': cluster.cluster_id,
              },
              skipTargetCreation: true,
            },
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
  {
    id: Steps.CLUSTER_AWS_INSTANCE_RELATIONSHIPS,
    name: 'Build Cluster Is AWS Instance Relationships',
    entities: [],
    relationships: [],
    mappedRelationships: [MappedRelationships.CLUSTER_IS_AWS_INSTANCE],
    dependsOn: [Steps.CLUSTERS],
    executionHandler: buildClusterIsAwsInstanceRelationships,
  },
];
