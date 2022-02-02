import { getMockGroup, getMockUser } from '../../../test/mocks';
import { createGroupEntity, createUserEntity } from './converters';

describe('#createGroupEntity', () => {
  test('should convert to entity', () => {
    expect(createGroupEntity(getMockGroup())).toMatchSnapshot();
  });
});

describe('#createUserEntity', () => {
  test('should convert to entity', () => {
    expect(createUserEntity(getMockUser())).toMatchSnapshot();
  });
});
