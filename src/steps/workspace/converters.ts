import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';

// Removes https://, looks nicer without it when used as _key component or id.
// https://dbc-c50dbe80-ed72.cloud.databricks.com --> dbc-c50dbe80-ed72.cloud.databricks.com
function getHostPart(host: string) {
  if (host.includes('https://')) {
    return host.split('//')[1];
  }

  return host;
}

export function createWorkspaceEntity(host: string): Entity {
  return createIntegrationEntity({
    entityData: {
      source: {
        id: getHostPart(host),
      },
      assign: {
        _key: `databricks_workspace:${getHostPart(host)}`,
        _type: Entities.WORKSPACE._type,
        _class: Entities.WORKSPACE._class,
        name: getHostPart(host),
      },
    },
  });
}
