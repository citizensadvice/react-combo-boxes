import { useState } from 'react';

export function useModified(value, fn) {
  const [currentValue, setCurrentValue] = useState(value);

  if (currentValue !== value) {
    fn();
    setCurrentValue(value);
  }
}
