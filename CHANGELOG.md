# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Added

- Added support for ingesting the following **new** mapped relationships:

  | Source               | class  | Target         |
  | -------------------- | ------ | -------------- |
  | `databricks_cluster` | **IS** | `aws_instance` |

## 1.0.0 - 2022-02-09

Initial Databricks integration

- Ingest new entity `databricks_user`
- Ingest new entity `databricks_group`
- Ingest new entity `databricks_cluster`
- Ingest new entity `databricks_workspace`

- Build new relationship `databricks_group_has_user`
- Build new relationship `databricks_user_created_cluster`
- Build new relationship `databricks_workspace_has_cluster`
- Build new relationship `databricks_workspace_has_group`
