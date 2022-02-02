import {
  createMockStepExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { fetchWorkspaceDetails } from '.';
import { integrationConfig } from '../../../test/config';
import { setupDatabricksRecording } from '../../../test/recording';
import { IntegrationConfig } from '../../config';

describe('#fetchWorkspaceDetails', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupDatabricksRecording({
      directory: __dirname,
      name: 'fetchWorkspaceDetails',
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

    expect({
      numCollectedEntities: context.jobState.collectedEntities.length,
      collectedEntities: context.jobState.collectedEntities,
      encounteredTypes: context.jobState.encounteredTypes,
    }).toMatchSnapshot();

    const workspaces = context.jobState.collectedEntities.filter((e) =>
      e._type.includes('databricks_workspace'),
    );
    expect(workspaces.length).toBe(1);
    expect(workspaces).toMatchGraphObjectSchema({
      _class: ['Account'],
      schema: {
        additionalProperties: false,
        properties: {
          _rawData: {
            type: 'array',
            items: { type: 'object' },
          },
          _type: { const: 'databricks_workspace' },
          name: { type: 'string' },
        },
      },
    });
  });
});
