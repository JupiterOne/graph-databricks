import { getMockCluster } from '../../../test/mocks';
import { createClusterEntity } from './converters';

describe('#createClusterEntity', () => {
  test('should convert to entity', () => {
    expect(createClusterEntity(getMockCluster())).toMatchSnapshot();
  });
});
