import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';

export function createWorkspaceEntity(subdomain: string): Entity {
  return createIntegrationEntity({
    entityData: {
      source: {
        id: subdomain,
      },
      assign: {
        _key: `databricks_workspace:${subdomain}`,
        _type: Entities.WORKSPACE._type,
        _class: Entities.WORKSPACE._class,
        name: subdomain,
      },
    },
  });
}
