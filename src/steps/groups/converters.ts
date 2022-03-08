import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';
import { DatabricksUser } from '../../types';
import { Entities } from '../constants';

export function createGroupEntity(groupName: string): Entity {
  return createIntegrationEntity({
    entityData: {
      source: {
        name: groupName,
      },
      assign: {
        _type: Entities.GROUP._type,
        _class: Entities.GROUP._class,
        _key: `databricks_group:${groupName}`,
        name: groupName,
        displayName: groupName,
      },
    },
  });
}

export function getUserKey(username: string) {
  return `databricks_user:${username}`;
}

export function createUserEntity(user: DatabricksUser): Entity {
  return createIntegrationEntity({
    entityData: {
      source: {
        username: user.user_name,
      },
      assign: {
        _type: Entities.USER._type,
        _class: Entities.USER._class,
        _key: getUserKey(user.user_name),
        name: user.user_name,
        username: user.user_name,
        active: true,
      },
    },
  });
}
