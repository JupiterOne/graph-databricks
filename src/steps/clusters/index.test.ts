import {
  executeStepWithDependencies,
  filterGraphObjects,
  Recording,
} from '@jupiterone/integration-sdk-testing';

import { buildStepTestConfigForStep } from '../../../test/config';
import { setupDatabricksRecording } from '../../../test/recording';
import { Steps } from '../constants';

describe('clustersSteps', () => {
  let recording: Recording;

  afterEach(async () => {
    await recording.stop();
  });

  describe('#fetchClusters', () => {
    test('should collect data', async () => {
      recording = setupDatabricksRecording({
        directory: __dirname,
        name: 'fetchClusters',
      });

      const stepConfig = buildStepTestConfigForStep(Steps.CLUSTERS);
      const stepResult = await executeStepWithDependencies(stepConfig);
      expect(stepResult).toMatchStepMetadata(stepConfig);
    });
  });

  describe('#buildClusterUserRelationships', () => {
    test('should collect data', async () => {
      recording = setupDatabricksRecording({
        directory: __dirname,
        name: 'buildClusterUserRelationships',
      });

      const stepConfig = buildStepTestConfigForStep(
        Steps.CLUSTER_USER_RELATIONSHIPS,
      );
      const stepResult = await executeStepWithDependencies(stepConfig);
      expect(stepResult).toMatchStepMetadata(stepConfig);
    });
  });

  describe('#buildClusterIsAWSInstanceRelationships', () => {
    test('should collect data', async () => {
      recording = setupDatabricksRecording({
        directory: __dirname,
        name: 'buildClusterIsAWSInstanceRelationships',
      });

      const stepConfig = buildStepTestConfigForStep(
        Steps.CLUSTER_AWS_INSTANCE_RELATIONSHIPS,
      );
      const { collectedEntities, collectedRelationships } =
        await executeStepWithDependencies(stepConfig);
      expect(collectedEntities).toHaveLength(0);

      const { targets: mappedRelationships, rest: directRelationships } =
        filterGraphObjects(collectedRelationships, (r) => !!r._mapping);

      expect(directRelationships).toHaveLength(0);
      expect(mappedRelationships.length).toEqual(1);
      expect(
        mappedRelationships.every(
          (mappedRelationship) =>
            mappedRelationship._key ===
            'databricks_cluster:0222-151525-vwdam92b|is|FORWARD:tag.ClusterId=0222-151525-vwdam92b:_type=aws_instance:_class=Host',
        ),
      ).toBe(true);
    });
  });
});
