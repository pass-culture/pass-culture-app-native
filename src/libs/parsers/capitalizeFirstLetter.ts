export function capitalizeFirstLetter(
  value: string | number | null | undefined
): string | undefined {
  if (value === undefined || value === null) return undefined
  return typeof value === 'string' ? value.charAt(0).toUpperCase() + value.slice(1) : String(value)
}
