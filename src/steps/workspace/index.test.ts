import {
  executeStepWithDependencies,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { buildStepTestConfigForStep } from '../../../test/config';
import { setupDatabricksRecording } from '../../../test/recording';
import { Steps } from '../constants';

describe('workspaceSteps', () => {
  let recording: Recording;

  afterEach(async () => {
    await recording.stop();
  });

  describe('#fetchWorkspaceDetails', () => {
    test('should collect data', async () => {
      recording = setupDatabricksRecording({
        directory: __dirname,
        name: 'fetchWorkspaceDetails',
      });

      const stepConfig = buildStepTestConfigForStep(Steps.WORKSPACE);
      const stepResult = await executeStepWithDependencies(stepConfig);
      expect(stepResult).toMatchStepMetadata(stepConfig);
    });
  });
});
