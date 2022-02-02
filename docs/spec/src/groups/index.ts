import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const groupSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: databricks.com/api/2.0/groups/list
     * PATTERN: Fetch Entities
     */
    id: 'fetch-groups',
    name: 'Fetch Groups',
    entities: [
      {
        resourceName: 'Group',
        _type: 'databricks_group',
        _class: ['UserGroup'],
      },
    ],
    relationships: [
      {
        _type: 'databricks_workspace_has_group',
        sourceType: 'databricks_workspace',
        _class: RelationshipClass.HAS,
        targetType: 'databricks_group',
      },
    ],
    dependsOn: ['fetch-workspace'],
    implemented: true,
  },
  {
    /**
     * ENDPOINT: databricks.com/api/2.0/groups/list-members?group_name=${groupName}
     * PATTERN: Fetch Child Entities
     */
    id: 'fetch-group-users',
    name: 'Build Group User Relationships',
    entities: [
      {
        resourceName: 'User',
        _type: 'databricks_user',
        _class: ['User'],
      },
    ],
    relationships: [
      {
        _type: 'databricks_group_has_user',
        sourceType: 'databricks_group',
        _class: RelationshipClass.HAS,
        targetType: 'databricks_user',
      },
    ],
    dependsOn: ['fetch-groups'],
    implemented: true,
  },
];
