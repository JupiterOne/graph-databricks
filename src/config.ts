import {
  IntegrationExecutionContext,
  IntegrationValidationError,
  IntegrationInstanceConfigFieldMap,
  IntegrationInstanceConfig,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from './client';

export const instanceConfigFields: IntegrationInstanceConfigFieldMap = {
  databricksSubdomain: {
    type: 'string',
  },
  databricksAccessToken: {
    type: 'string',
    mask: true,
  },
};

export interface IntegrationConfig extends IntegrationInstanceConfig {
  databricksSubdomain: string;
  databricksAccessToken: string;
}

export async function validateInvocation(
  context: IntegrationExecutionContext<IntegrationConfig>,
) {
  const { config } = context.instance;

  if (!config.databricksSubdomain || !config.databricksAccessToken) {
    throw new IntegrationValidationError(
      'Config requires all of {databricksSubdomain, databricksAccessToken}',
    );
  }

  const apiClient = createAPIClient(config);
  await apiClient.verifyAuthentication();
}
