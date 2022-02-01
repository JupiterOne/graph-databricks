import {
  RelationshipClass,
  StepEntityMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';

export const Steps = {
  WORKSPACE: 'fetch-workspace',
  USERS: 'fetch-users',
  GROUPS: 'fetch-groups',
  GROUP_USERS: 'fetch-group-users',
  GROUP_USER_RELATIONSHIPS: 'build-user-group-relationships',
  CLUSTERS: 'fetch-clusters',
  CLUSTER_USER_RELATIONSHIPS: 'build-cluster-user-relationships',
};

export const Entities: Record<
  'WORKSPACE' | 'GROUP' | 'USER' | 'CLUSTER',
  StepEntityMetadata
> = {
  WORKSPACE: {
    resourceName: 'Workspace',
    _type: 'databricks_workspace',
    _class: ['Account'],
  },
  GROUP: {
    resourceName: 'Group',
    _type: 'databricks_group',
    _class: ['UserGroup'],
  },
  USER: {
    resourceName: 'User',
    _type: 'databricks_user',
    _class: ['User'],
  },
  CLUSTER: {
    resourceName: 'Cluster',
    _type: 'databricks_cluster',
    _class: ['Cluster'],
  },
};

export const Relationships: Record<
  | 'WORKSPACE_HAS_GROUP'
  | 'WORKSPACE_HAS_CLUSTER'
  | 'GROUP_HAS_USER'
  | 'USER_CREATED_CLUSTER',
  StepRelationshipMetadata
> = {
  WORKSPACE_HAS_GROUP: {
    _type: 'databricks_workspace_has_group',
    sourceType: Entities.WORKSPACE._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.GROUP._type,
  },
  WORKSPACE_HAS_CLUSTER: {
    _type: 'databricks_workspace_has_cluster',
    sourceType: Entities.WORKSPACE._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.CLUSTER._type,
  },
  GROUP_HAS_USER: {
    _type: 'databricks_group_has_user',
    sourceType: Entities.GROUP._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.USER._type,
  },
  USER_CREATED_CLUSTER: {
    _type: 'databricks_user_created_cluster',
    sourceType: Entities.USER._type,
    _class: RelationshipClass.CREATED,
    targetType: Entities.CLUSTER._type,
  },
};
