export function joinTokens(...names) {
  return (
    []
      .concat(...names)
      .filter(Boolean)
      .join(' ') || null
  );
}
