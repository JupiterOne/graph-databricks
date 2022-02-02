import { getMockWorkspace } from '../../../test/mocks';
import { createWorkspaceEntity } from './converters';

describe('#createWorkspaceEntity', () => {
  test('should convert to entity', () => {
    expect(createWorkspaceEntity(getMockWorkspace())).toMatchSnapshot();
  });
});
