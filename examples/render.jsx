import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import * as components from './**/*.jsx'; // eslint-disable-line import/no-unresolved, import/extensions

document.querySelectorAll('[data-react-example]').forEach((node) => {
  const parts = node.dataset.reactExample.split('/');
  let target = components;
  parts.forEach((part) => {
    target = target[part];
  });

  target = target.index;

  createRoot(node).render(
    <StrictMode>
      <target.Example />
    </StrictMode>,
  );
});
