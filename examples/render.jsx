import React from 'react';
import ReactDOM from 'react-dom';
import * as components from '**/*.jsx'; // eslint-disable-line import/no-unresolved, import/extensions

document.querySelectorAll('[data-react-example]').forEach((node) => {
  const parts = node.dataset.reactExample.split('/');
  let target = components;
  parts.forEach((part) => {
    target = target[part];
  });

  target = target.index;

  ReactDOM.render(
    <target.Example />,
    node,
  );
});
