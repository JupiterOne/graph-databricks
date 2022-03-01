import {
  createMockStepExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import {
  buildClusterIsAwsInstanceRelationships,
  buildClusterUserRelationships,
  fetchClusters,
} from '.';
import { fetchGroups, fetchGroupUsers } from '../groups';
import { integrationConfig } from '../../../test/config';
import { setupDatabricksRecording } from '../../../test/recording';
import { IntegrationConfig } from '../../config';
import { Relationships } from '../constants';
import { fetchWorkspaceDetails } from '../workspace';
import { separateDirectMappedRelationships } from '../../../test/helpers/separateDirectMappedRelationships';

describe('#fetchClusters', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupDatabricksRecording({
      directory: __dirname,
      name: 'fetchClusters',
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
    await fetchClusters(context);

    expect({
      numCollectedEntities: context.jobState.collectedEntities.length,
      collectedEntities: context.jobState.collectedEntities,
      encounteredTypes: context.jobState.encounteredTypes,
    }).toMatchSnapshot();

    const clusters = context.jobState.collectedEntities.filter((e) =>
      e._type.includes('databricks_cluster'),
    );

    expect(clusters.length).toBeGreaterThan(0);
    expect(clusters).toMatchGraphObjectSchema({
      _class: ['Cluster'],
      schema: {
        additionalProperties: false,
        properties: {
          _rawData: {
            type: 'array',
            items: { type: 'object' },
          },
          _type: { const: 'databricks_cluster' },
          name: { type: 'string' },
          creator: { type: 'string' },
          state: { type: 'string' },
          active: { type: 'boolean' },
          autoTerminationMinutes: { type: 'number' },
          enableElasticDisk: { type: 'boolean' },
          enableLocalDiskEncryption: { type: 'boolean' },
          initScriptsSafeMode: { type: 'boolean' },
          nodeTypeId: { type: 'string' },
          createdOn: { type: 'number' },
          terminatedOn: { type: 'number' },
        },
      },
    });

    const workspaceHasClusters = context.jobState.collectedRelationships.filter(
      (e) => e._type === Relationships.WORKSPACE_HAS_CLUSTER._type,
    );

    expect(workspaceHasClusters.length).toBeGreaterThan(0);
    expect(workspaceHasClusters).toMatchDirectRelationshipSchema({
      schema: {
        properties: {
          _class: { const: 'HAS' },
          _type: {
            const: 'databricks_workspace_has_cluster',
          },
        },
      },
    });
  });
});

describe('#buildClusterUserRelationships', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupDatabricksRecording({
      directory: __dirname,
      name: 'buildClusterUserRelationships',
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
    await fetchClusters(context);
    await buildClusterUserRelationships(context);

    expect({
      numCollectedEntities: context.jobState.collectedEntities.length,
      collectedEntities: context.jobState.collectedEntities,
      encounteredTypes: context.jobState.encounteredTypes,
    }).toMatchSnapshot();

    const clusters = context.jobState.collectedEntities.filter((e) =>
      e._type.includes('databricks_cluster'),
    );
    const users = context.jobState.collectedEntities.filter((e) =>
      e._type.includes('databricks_user'),
    );

    expect(clusters.length).toBeGreaterThan(0);
    expect(users.length).toBeGreaterThan(0);

    const userCreatedClusters = context.jobState.collectedRelationships.filter(
      (e) => e._type === Relationships.USER_CREATED_CLUSTER._type,
    );

    expect(userCreatedClusters.length).toBeGreaterThan(0);
    expect(userCreatedClusters).toMatchDirectRelationshipSchema({
      schema: {
        properties: {
          _class: { const: 'CREATED' },
          _type: {
            const: 'databricks_user_created_cluster',
          },
        },
      },
    });
  });
});

describe('#buildClusterIsAWSInstanceRelationships', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupDatabricksRecording({
      directory: __dirname,
      name: 'buildClusterIsAWSInstanceRelationships',
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
    await fetchClusters(context);
    await buildClusterIsAwsInstanceRelationships(context);

    expect({
      numCollectedEntities: context.jobState.collectedEntities.length,
      collectedEntities: context.jobState.collectedEntities,
      encounteredTypes: context.jobState.encounteredTypes,
    }).toMatchSnapshot();

    const { directRelationships, mappedRelationships } =
      separateDirectMappedRelationships(
        context.jobState.collectedRelationships,
      );

    expect(directRelationships.length).toBeGreaterThan(0);
    expect(directRelationships).toMatchDirectRelationshipSchema({
      schema: {
        properties: {
          _class: { const: 'HAS' },
          _type: {
            const: 'databricks_workspace_has_cluster',
          },
        },
      },
    });

    expect(mappedRelationships.length).toBeGreaterThan(0);
    expect(
      mappedRelationships
        .filter(
          (e) =>
            e._mapping.sourceEntityKey ===
            'databricks_cluster:0222-151525-vwdam92b',
        )
        .every(
          (mappedRelationship) =>
            mappedRelationship._key ===
            'databricks_cluster:0222-151525-vwdam92b|is|FORWARD:tag.ClusterId=0222-151525-vwdam92b:_type=aws_instance:_class=Host',
        ),
    ).toBe(true);
  });
});
