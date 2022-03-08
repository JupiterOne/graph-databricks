# Development

This integration focuses on [Databricks](https://databricks.com/) and is using
[Databricks API](https://docs.databricks.com/dev-tools/api/latest/index.html)
for interacting with the Databricks resources.

## Provider account setup

### Follow these steps to create the necessary Zoom app:

1. Go to [Databricks GCP dashboard](https://accounts.gcp.databricks.com/login)
   and log in.

2. In the [Workspaces section](https://accounts.gcp.databricks.com/workspaces),
   choose the workspace.

3. You will be able to see the URL on the following page that has the following
   format: https://[numbers].[number].gcp.databricks.com

4. Take note of it and supply it to the .env file. (Example,
   DATABRICKS_HOST=https://1122334455.6.gcp.databricks.com)

5. Next, click on that link to go to the workspace dashboard. Once there, click
   on the settings icon (bottom part of left side menu) and choose "User
   settings".

6. Click "Generate New Token", add comment/description, and press "Generate".
   Make sure to copy the token and supply it as the ENV variable
   (DATABRICKS_ACCESS_TOKEN=[token you've just generated])

## Authentication

Copy the `.env.example` to `.env` file and fill in the variables using the user
information and API token information generated from instructions above. The
mapping is as follows:

- DATABRICKS_HOST= ${`host`}
- DATABRICKS_ACCESS_TOKEN= ${`accessToken`}
