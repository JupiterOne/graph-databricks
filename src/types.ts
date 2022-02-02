export interface DatabricksCluster {
  cluster_id: string;
  driver: {
    private_ip: string;
  };
  spark_context_id?: number;
  cluster_name: string;
  spark_version: string;
  spark_conf?: {
    'spark.master': string;
    'spark.databricks.cluster.profile': string;
  };
  node_type_id: string;
  driver_node_type_id: string;
  custom_tags?: {
    ResourceClass: string;
  };
  spark_env_vars: Record<string, string>;
  autotermination_minutes: number;
  enable_elastic_disk: boolean;
  disk_spec: any;
  cluster_source: string;
  enable_local_disk_encryption: boolean;
  gcp_attributes: {
    use_preemptible_executors: boolean;
    availability: string;
    zone_id: string;
  };
  instance_source: {
    node_type_id: string;
  };
  driver_instance_source: {
    node_type_id: string;
  };
  state: string;
  state_message?: string;
  start_time: number;
  terminated_time: any;
  last_state_loss_time: number;
  autoscale?: {
    min_workers: number;
    max_workers: number;
  };
  num_workers?: number;
  cluster_memory_mb?: number;
  cluster_cores?: number;
  default_tags: {
    Vendor: string;
    Creator: string;
    ClusterName: string;
    ClusterId: string;
  };
  creator_user_name: string;
  termination_reason?: {
    code: string;
    parameters: {
      gcp_error_message: string;
    };
    type: string;
  };
  init_scripts_safe_mode: boolean;
}

export interface ClustersResponse {
  clusters: DatabricksCluster[];
}

export interface DatabricksUser {
  user_name: string;
}

export interface GroupUsersResponse {
  members: DatabricksUser[];
}

export interface GroupsResponse {
  group_names: string[];
}
