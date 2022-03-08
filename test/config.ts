import { IntegrationInvocationConfig } from '@jupiterone/integration-sdk-core';
import { StepTestConfig } from '@jupiterone/integration-sdk-testing';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { invocationConfig } from '../src';
import { IntegrationConfig } from '../src/config';

if (process.env.LOAD_ENV) {
  dotenv.config({
    path: path.join(__dirname, '../.env'),
  });
}
const DEFAULT_DATABRICKS_HOST =
  'https://dbc-c50dbe80-ed72.cloud.databricks.com';
const DEFAULT_DATABRICKS_ACCESS_TOKEN = 'dummy-databricks-access-token';

export const integrationConfig: IntegrationConfig = {
  databricksHost: process.env.DATABRICKS_HOST || DEFAULT_DATABRICKS_HOST,
  databricksAccessToken:
    process.env.DATABRICKS_ACCESS_TOKEN || DEFAULT_DATABRICKS_ACCESS_TOKEN,
};

export function buildStepTestConfigForStep(stepId: string): StepTestConfig {
  return {
    stepId,
    instanceConfig: integrationConfig,
    invocationConfig: invocationConfig as IntegrationInvocationConfig,
  };
}
