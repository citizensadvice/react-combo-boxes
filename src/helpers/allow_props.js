export function allowProps(object, ...names) {
  const props = {};
  Object.keys(object).forEach((name) => {
    if (name !== undefined && names.includes(name)) {
      props[name] = object[name];
    }
  });
  return props;
}
