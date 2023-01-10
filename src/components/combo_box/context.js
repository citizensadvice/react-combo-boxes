import { createContext } from 'react';
import { visuallyHiddenClassName } from '../../constants/visually_hidden_class_name';

export const Context = createContext({
  visuallyHiddenClassName,
  dispatch: null,
});
