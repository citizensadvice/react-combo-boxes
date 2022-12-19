export function optionise(rawOption, mapOption) {
  let option = rawOption;
  if (option != null && typeof rawOption === 'object') {
    option = mapOption ? mapOption(rawOption) : rawOption;
  }

  if (option != null && typeof option === 'object') {
    const { label, group, value, disabled, html, id, description } = option;
    return {
      label: label ?? '',
      group,
      disabled: !!disabled,
      unselectable: !!disabled,
      identity: String(value ?? id ?? label ?? ''),
      value: rawOption,
      description,
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
