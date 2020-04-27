export function renderGroupedOptions({ options, renderGroup, renderOption }) {
  const groups = new Map();
  return options.reduce((accumulator, option) => {
    const renderedOption = renderOption(option);
    if (option.group) {
      if (groups.has(option.group)) {
        groups.get(option.group).push(renderedOption);
      } else {
        const children = [renderedOption];
        groups.set(option.group, children);
        accumulator.push(renderGroup({ ...option.group, children }));
      }
    } else {
      accumulator.push(renderedOption);
    }
    return accumulator;
  }, []);
}
