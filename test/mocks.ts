import { DatabricksCluster, DatabricksUser } from '../src/types';

export function getMockWorkspace(): string {
  return '3840207185082406.6';
}

export function getMockGroup(): string {
  return 'test-group-b';
}

export function getMockUser(): DatabricksUser {
  return {
    user_name: 'mock-user@gmail.com',
  };
}

export function getMockCluster(): DatabricksCluster {
  return {
    cluster_id: '0117-142331-yanks462',
    driver: { private_ip: '127.0.0.1' },
    cluster_name: 'test-gcp-cluster',
    spark_version: '9.1.x-scala2.12',
    node_type_id: 'n1-standard-4',
    driver_node_type_id: 'n1-standard-4',
    spark_env_vars: { PYSPARK_PYTHON: '/databricks/python3/bin/python3' },
    autotermination_minutes: 20,
    enable_elastic_disk: false,
    disk_spec: {},
    cluster_source: 'UI',
    enable_local_disk_encryption: false,
    gcp_attributes: {
      use_preemptible_executors: false,
      availability: 'ON_DEMAND_GCP',
      zone_id: 'HA',
    },
    instance_source: { node_type_id: 'n1-standard-4' },
    driver_instance_source: { node_type_id: 'n1-standard-4' },
    state: 'TERMINATED',
    state_message: 'Cluster terminated by CLOUD_PROVIDER_LAUNCH_FAILURE',
    start_time: 1642429411156,
    terminated_time: 1642429429719,
    last_state_loss_time: 1642429429732,
    autoscale: { min_workers: 1, max_workers: 2 },
    default_tags: {
      Vendor: 'Databricks',
      Creator: 'test-user@gmail.com',
      ClusterName: 'test-gcp-cluster',
      ClusterId: '0117-142331-yanks462',
    },
    creator_user_name: 'test-user@gmail.com',
    init_scripts_safe_mode: false,
  };
}
