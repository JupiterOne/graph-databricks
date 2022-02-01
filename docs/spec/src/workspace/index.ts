import { StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const workspaceSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: n/a
     * PATTERN: Singleton
     */
    id: 'fetch-workspace',
    name: 'Fetch Workspace Details',
    entities: [
      {
        resourceName: 'Workspace',
        _type: 'databricks_workspace',
        _class: ['Account'],
      },
    ],
    relationships: [],
    dependsOn: [],
    implemented: true,
  },
];
