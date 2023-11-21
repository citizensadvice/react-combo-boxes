import { useCallback } from 'react';

// @private
export function useCombineRefs(...refs) {
  return useCallback(
    (value) => {
      refs.forEach((ref) => {
        if (typeof ref === 'function') {
          ref(value);
        } else if (ref) {
          ref.current = value;
        }
      });
    },
    [...refs], // eslint-disable-line react-hooks/exhaustive-deps
  );
}
