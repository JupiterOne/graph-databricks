import { workspaceSteps } from './workspace';
import { groupSteps } from './groups';
import { clusterSteps } from './clusters';

const integrationSteps = [...workspaceSteps, ...groupSteps, ...clusterSteps];

export { integrationSteps };
