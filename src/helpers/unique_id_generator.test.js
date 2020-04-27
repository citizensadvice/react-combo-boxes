import { UniqueIdGenerator } from './unique_id_generator';

it('returns unique values as is', () => {
  const idGenerator = new UniqueIdGenerator();
  expect(idGenerator.uniqueId('foo')).toEqual('foo');
  expect(idGenerator.uniqueId('bar')).toEqual('bar');
});

it('appends sequential indexes to duplicate values', () => {
  const idGenerator = new UniqueIdGenerator();
  expect(idGenerator.uniqueId('foo')).toEqual('foo');
  expect(idGenerator.uniqueId('foo')).toEqual('foo_1');
  expect(idGenerator.uniqueId('foo')).toEqual('foo_2');
});

it('increases existing sequential indexes', () => {
  const idGenerator = new UniqueIdGenerator();
  expect(idGenerator.uniqueId('foo_99')).toEqual('foo_99');
  expect(idGenerator.uniqueId('foo_99')).toEqual('foo_100');
});
