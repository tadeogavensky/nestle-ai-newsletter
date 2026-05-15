export function enumToOptions<T extends string>(
  enumObj: Record<string, T>,
  labelMap: Record<T, string>,
): Array<{ value: T; label: string }> {
  return Object.values(enumObj).map((value) => ({
    value,
    label: labelMap[value],
  }))
}
