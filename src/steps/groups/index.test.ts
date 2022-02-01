import {
  createMockStepExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { fetchGroups, fetchGroupUsers } from '.';
import { integrationConfig } from '../../../test/config';
import { setupDatabricksRecording } from '../../../test/recording';
import { IntegrationConfig } from '../../config';
import { Relationships } from '../constants';
import { fetchWorkspaceDetails } from '../workspace';

describe('#fetchGroups', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupDatabricksRecording({
      directory: __dirname,
      name: 'fetchGroups',
    });
  });

  afterEach(async () => {
    await recording.stop();
  });

  test('should collect data', async () => {
    const context = createMockStepExecutionContext<IntegrationConfig>({
      instanceConfig: integrationConfig,
    });

    await fetchWorkspaceDetails(context);
    await fetchGroups(context);

    expect({
      numCollectedEntities: context.jobState.collectedEntities.length,
      collectedEntities: context.jobState.collectedEntities,
      encounteredTypes: context.jobState.encounteredTypes,
    }).toMatchSnapshot();

    const groups = context.jobState.collectedEntities.filter((e) =>
      e._type.includes('databricks_group'),
    );

    expect(groups.length).toBeGreaterThan(0);
    expect(groups).toMatchGraphObjectSchema({
      _class: ['UserGroup'],
      schema: {
        additionalProperties: false,
        properties: {
          _rawData: {
            type: 'array',
            items: { type: 'object' },
          },
          _type: { const: 'databricks_group' },
          name: { type: 'string' },
          displayName: { type: 'string' },
        },
      },
    });

    const workspaceHasGroups = context.jobState.collectedRelationships.filter(
      (e) => e._type === Relationships.WORKSPACE_HAS_GROUP._type,
    );

    expect(workspaceHasGroups.length).toBeGreaterThan(0);
    expect(workspaceHasGroups).toMatchDirectRelationshipSchema({
      schema: {
        properties: {
          _class: { const: 'HAS' },
          _type: {
            const: 'databricks_workspace_has_group',
          },
        },
      },
    });
  });
});

describe('#fetchGroupUsers', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupDatabricksRecording({
      directory: __dirname,
      name: 'fetchGroupUsers',
    });
  });

  afterEach(async () => {
    await recording.stop();
  });

  test('should collect data', async () => {
    const context = createMockStepExecutionContext<IntegrationConfig>({
      instanceConfig: integrationConfig,
    });

    await fetchWorkspaceDetails(context);
    await fetchGroups(context);
    await fetchGroupUsers(context);

    expect({
      numCollectedEntities: context.jobState.collectedEntities.length,
      collectedEntities: context.jobState.collectedEntities,
      encounteredTypes: context.jobState.encounteredTypes,
    }).toMatchSnapshot();

    const users = context.jobState.collectedEntities.filter((e) =>
      e._type.includes('databricks_user'),
    );

    expect(users.length).toBeGreaterThan(0);
    expect(users).toMatchGraphObjectSchema({
      _class: ['User'],
      schema: {
        additionalProperties: false,
        properties: {
          _rawData: {
            type: 'array',
            items: { type: 'object' },
          },
          _type: { const: 'databricks_user' },
          name: { type: 'string' },
          username: { type: 'string' },
        },
      },
    });

    const groupHasUsers = context.jobState.collectedRelationships.filter(
      (e) => e._type === Relationships.GROUP_HAS_USER._type,
    );

    expect(groupHasUsers.length).toBeGreaterThan(0);
    expect(groupHasUsers).toMatchDirectRelationshipSchema({
      schema: {
        properties: {
          _class: { const: 'HAS' },
          _type: {
            const: 'databricks_group_has_user',
          },
        },
      },
    });
  });
});
