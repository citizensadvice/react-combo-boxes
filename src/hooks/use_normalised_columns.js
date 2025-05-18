import { useMemo } from 'react';
import { UniqueIdGenerator } from '../helpers/unique_id_generator';

/**
 * @private
 */
export function useNormalisedColumns(columns) {
  return useMemo(() => {
    const idGenerator = new UniqueIdGenerator();
    return columns.map((column) => {
      if (typeof column === 'string') {
        return {
          name: column,
          key: idGenerator.uniqueId(column),
        };
      }
      return {
        ...column,
        key: idGenerator.uniqueId(column.name),
      };
    });
  }, [columns]);
}
