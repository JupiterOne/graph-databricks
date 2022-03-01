import fetch from 'node-fetch';

import {
  IntegrationProviderAPIError,
  IntegrationProviderAuthenticationError,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from './config';
import {
  GroupUsersResponse,
  DatabricksUser,
  GroupsResponse,
  DatabricksCluster,
  ClustersResponse,
} from './types';

export type ResourceIteratee<T> = (each: T) => Promise<void> | void;

export class APIClient {
  constructor(readonly config: IntegrationConfig) {}

  private withBaseUri(path: string): string {
    if (this.config.databricksHost.includes('https://')) {
      return `${this.config.databricksHost}/api/${path}`;
    } else {
      return `https://${this.config.databricksHost}/api/${path}`;
    }
  }

  private async request<T>(
    uri: string,
    method: 'GET' | 'HEAD' = 'GET',
    retries: number = 1,
    backoffTime: number = 5,
  ): Promise<T> {
    try {
      const response = await fetch(uri, {
        method,
        headers: {
          Authorization: `Bearer ${this.config.databricksAccessToken}`,
        },
      });

      if (response.status === 429) {
        if (retries >= 10) {
          throw new IntegrationProviderAPIError({
            endpoint: uri,
            status: response.status,
            statusText:
              'Failed to get response after retrying multiple times (n = 10)',
          });
        }

        // Rate limit exceeded
        // We want to wait for 5s and then retry (but also increasing the waiting for each subsequent try)
        // Max times: 10
        const retryAfterMs = backoffTime * retries * 1000;
        await new Promise((resolve) => setTimeout(resolve, retryAfterMs));
        return this.request(uri, method, retries + 1);
      }

      if (response.status === 500) {
        if (retries > 1) {
          throw new IntegrationProviderAPIError({
            endpoint: uri,
            status: response.status,
            statusText: 'Failed to get response after retrying',
          });
        }

        // We want to wait for ~3s and then retry
        // Max times: 1
        const retryAfterMs = 3 * 1000;
        await new Promise((resolve) => setTimeout(resolve, retryAfterMs));
        return this.request(uri, method, retries + 1);
      }

      return response.json();
    } catch (err) {
      throw new IntegrationProviderAPIError({
        endpoint: uri,
        status: err.status,
        statusText: err.statusText,
      });
    }
  }

  public async verifyAuthentication(): Promise<void> {
    const endpoint = this.withBaseUri('2.0/groups/list');

    try {
      await this.request<GroupsResponse>(endpoint, 'GET');
    } catch (err) {
      throw new IntegrationProviderAuthenticationError({
        endpoint,
        status: err.code,
        statusText: err.message,
      });
    }
  }

  /**
   * Iterates each group resource in the provider. This endpoint doesn't support pagination.
   *
   * @param iteratee receives each group to produce entities/relationships
   */
  public async iterateGroups(
    iteratee: ResourceIteratee<string>,
  ): Promise<void> {
    const endpoint = this.withBaseUri('2.0/groups/list');
    const response = await this.request<GroupsResponse>(endpoint, 'GET');

    for (const group of response.group_names || []) {
      await iteratee(group);
    }
  }

  /**
   * Iterates each member in the particular group in the provider. This endpoint doesn't support pagination.
   *
   * @param iteratee receives each user in a group to produce entities/relationships
   */
  public async iterateGroupUsers(
    groupName: string,
    iteratee: ResourceIteratee<DatabricksUser>,
  ): Promise<void> {
    const endpoint = this.withBaseUri(
      `2.0/groups/list-members?group_name=${groupName}`,
    );
    const response = await this.request<GroupUsersResponse>(endpoint, 'GET');

    for (const user of response.members || []) {
      await iteratee(user);
    }
  }

  /**
   * Iterates each cluster in the workspace in the provider. This endpoint doesn't support pagination.
   *
   * @param iteratee receives each cluster to produce entities/relationships
   */
  public async iterateClusters(
    iteratee: ResourceIteratee<DatabricksCluster>,
  ): Promise<void> {
    const endpoint = this.withBaseUri('2.0/clusters/list');
    const response = await this.request<ClustersResponse>(endpoint, 'GET');

    for (const cluster of response.clusters || []) {
      await iteratee(cluster);
    }
  }
}

export function createAPIClient(config: IntegrationConfig): APIClient {
  return new APIClient(config);
}
