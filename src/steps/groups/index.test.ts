import {
  executeStepWithDependencies,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { buildStepTestConfigForStep } from '../../../test/config';
import { setupDatabricksRecording } from '../../../test/recording';
import { Steps } from '../constants';

describe('groupsSteps', () => {
  let recording: Recording;

  afterEach(async () => {
    await recording.stop();
  });

  describe('#fetchGroups', () => {
    test('should collect data', async () => {
      recording = setupDatabricksRecording({
        directory: __dirname,
        name: 'fetchGroups',
      });

      const stepConfig = buildStepTestConfigForStep(Steps.GROUPS);
      const stepResult = await executeStepWithDependencies(stepConfig);
      expect(stepResult).toMatchStepMetadata(stepConfig);
    });
  });

  describe('#fetchGroupUsers', () => {
    test('should collect data', async () => {
      recording = setupDatabricksRecording({
        directory: __dirname,
        name: 'fetchGroupUsers',
      });

      const stepConfig = buildStepTestConfigForStep(Steps.GROUP_USERS);
      const stepResult = await executeStepWithDependencies(stepConfig);
      expect(stepResult).toMatchStepMetadata(stepConfig);
    });
  });
});
