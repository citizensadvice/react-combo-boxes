export function optionise(rawOption, mapOption) {
  const option = mapOption && rawOption != null ? mapOption(rawOption) : rawOption;
  if (option !== null && typeof option === 'object') {
    const { label, group, value, disabled, html, id } = option;
    return {
      label,
      group,
      disabled: !!disabled,
      unselectable: !!disabled,
      identity: String(value ?? id ?? label ?? ''),
      value: rawOption,
      html: { ...html },
    };
  }

  // A primitive
  return {
    label: String(option ?? ''),
    identity: String(option ?? ''),
    value: rawOption,
    unselectable: false,
    disabled: false,
  };
}
