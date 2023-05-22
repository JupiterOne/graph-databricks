# v1.3.0 (Mon May 22 2023)

#### 🚀 Enhancement

- Update version number to 1.2.0 [#21](https://github.com/JupiterOne/graph-databricks/pull/21) ([@Nick-NCSU](https://github.com/Nick-NCSU))
- INT-8228: comment change to initiate build [#19](https://github.com/JupiterOne/graph-databricks/pull/19) ([@sl45082](https://github.com/sl45082))

#### 🐛 Bug Fix

- INT-8228: gitignore typo [#18](https://github.com/JupiterOne/graph-databricks/pull/18) ([@sl45082](https://github.com/sl45082))
- INT-8228: adding auto for build, version and deployment [#17](https://github.com/JupiterOne/graph-databricks/pull/17) ([@sl45082](https://github.com/sl45082))
- Merging CodeQL [#15](https://github.com/JupiterOne/graph-databricks/pull/15) ([@electricgull](https://github.com/electricgull))
- Update questions.yaml [#13](https://github.com/JupiterOne/graph-databricks/pull/13) ([@ndowmon](https://github.com/ndowmon))
- Merged via j1-codeowners-automation-v1.0.0 [#12](https://github.com/JupiterOne/graph-databricks/pull/12) ([@erichs](https://github.com/erichs))
- Merged via j1-codeowners-automation-v1.0.0 [#9](https://github.com/JupiterOne/graph-databricks/pull/9) ([@erichs](https://github.com/erichs))
- Version 1.1.0 [#8](https://github.com/JupiterOne/graph-databricks/pull/8) ([@eXtremeX](https://github.com/eXtremeX))
- INT-2617 - Add Cluster -IS-> AWS instance relationships [#7](https://github.com/JupiterOne/graph-databricks/pull/7) ([@eXtremeX](https://github.com/eXtremeX))
- Version 1.0.0 [#3](https://github.com/JupiterOne/graph-databricks/pull/3) ([@eXtremeX](https://github.com/eXtremeX))
- INT-2348 - Initial Databricks integration [#2](https://github.com/JupiterOne/graph-databricks/pull/2) ([@eXtremeX](https://github.com/eXtremeX))

#### ⚠️ Pushed to `main`

- Initial commit ([@austinkelleher](https://github.com/austinkelleher))

#### Authors: 7

- Austin Kelleher ([@austinkelleher](https://github.com/austinkelleher))
- bob bisantz ([@sl45082](https://github.com/sl45082))
- Cameron Griffin ([@electricgull](https://github.com/electricgull))
- Erich Smith ([@erichs](https://github.com/erichs))
- Nick Dowmon ([@ndowmon](https://github.com/ndowmon))
- Nick Thompson ([@Nick-NCSU](https://github.com/Nick-NCSU))
- Stefan Virag ([@eXtremeX](https://github.com/eXtremeX))

---

## 1.1.0 - 2022-03-08

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
