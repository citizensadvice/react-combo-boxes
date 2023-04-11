export function optionise(rawOption, mapOption) {
  let option = rawOption;
  if (option != null && typeof rawOption === 'object') {
    option = mapOption ? mapOption(rawOption) : rawOption;
  }

  if (option != null && typeof option === 'object') {
    const { label, group, value, disabled, html, id, description, name, title, hint } = option;
    const calculatedLabel = label ?? name ?? title ?? '';
    return {
      label: calculatedLabel,
      group,
      disabled: !!disabled,
      unselectable: !!disabled,
      identity: String(value ?? id ?? calculatedLabel ?? ''),
      value: rawOption,
      description: description ?? hint,
      html: { ...html },
    };
  }

  // A primitive
  return {
    label: String(option ?? ''),
    identity: option != null ? String(option ?? '') : option,
    value: rawOption,
    unselectable: false,
    disabled: false,
  };
}
