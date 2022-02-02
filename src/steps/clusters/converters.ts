import {
  createIntegrationEntity,
  Entity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import { DatabricksCluster } from '../../types';
import { Entities } from '../constants';

export function createClusterEntity(cluster: DatabricksCluster): Entity {
  return createIntegrationEntity({
    entityData: {
      source: cluster,
      assign: {
        _type: Entities.CLUSTER._type,
        _class: Entities.CLUSTER._class,
        _key: `databricks_cluster:${cluster.cluster_id}`,
        name: cluster.cluster_name,
        creator: cluster.creator_user_name,
        state: cluster.state,
        active: cluster.state === 'RUNNING' ? true : false,
        autoTerminationMinutes: cluster.autotermination_minutes,
        enableElasticDisk: cluster.enable_elastic_disk,
        enableLocalDiskEncryption: cluster.enable_local_disk_encryption,
        initScriptsSafeMode: cluster.init_scripts_safe_mode,
        nodeTypeId: cluster.node_type_id,
        createdOn: parseTimePropertyValue(cluster.start_time),
        terminatedOn: parseTimePropertyValue(cluster.terminated_time),
      },
    },
  });
}
