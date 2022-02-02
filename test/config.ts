import * as dotenv from 'dotenv';
import * as path from 'path';
import { IntegrationConfig } from '../src/config';

if (process.env.LOAD_ENV) {
  dotenv.config({
    path: path.join(__dirname, '../.env'),
  });
}
const DEFAULT_DATABRICKS_SUBDOMAIN = '3840207185082406.6';
const DEFAULT_DATABRICKS_ACCESS_TOKEN = 'dummy-databricks-access-token';

export const integrationConfig: IntegrationConfig = {
  databricksSubdomain:
    process.env.DATABRICKS_SUBDOMAIN || DEFAULT_DATABRICKS_SUBDOMAIN,
  databricksAccessToken:
    process.env.DATABRICKS_ACCESS_TOKEN || DEFAULT_DATABRICKS_ACCESS_TOKEN,
};
