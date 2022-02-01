import {
  createDirectRelationship,
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { WORKSPACE_ENTITY_KEY } from '../workspace';
import { Entities, Relationships, Steps } from '../constants';
import { createGroupEntity, createUserEntity } from './converters';

export async function fetchGroups({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  const workspaceEntity = (await jobState.getData(
    WORKSPACE_ENTITY_KEY,
  )) as Entity;

  await apiClient.iterateGroups(async (group) => {
    const groupEntity = await jobState.addEntity(createGroupEntity(group));
    await jobState.addRelationship(
      createDirectRelationship({
        _class: RelationshipClass.HAS,
        from: workspaceEntity,
        to: groupEntity,
      }),
    );
  });
}

export async function fetchGroupUsers({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await jobState.iterateEntities(
    {
      _type: Entities.GROUP._type,
    },
    async (groupEntity) => {
      await apiClient.iterateGroupUsers(
        groupEntity.displayName!,
        async (user) => {
          const userEntity = await jobState.addEntity(createUserEntity(user));

          await jobState.addRelationship(
            createDirectRelationship({
              _class: RelationshipClass.HAS,
              from: groupEntity,
              to: userEntity,
            }),
          );
        },
      );
    },
  );
}

export const groupSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.GROUPS,
    name: 'Fetch Groups',
    entities: [Entities.GROUP],
    relationships: [Relationships.WORKSPACE_HAS_GROUP],
    dependsOn: [Steps.WORKSPACE],
    executionHandler: fetchGroups,
  },
  {
    id: Steps.GROUP_USERS,
    name: 'Build Group User Relationships',
    entities: [Entities.USER],
    relationships: [Relationships.GROUP_HAS_USER],
    dependsOn: [Steps.GROUPS],
    executionHandler: fetchGroupUsers,
  },
];
