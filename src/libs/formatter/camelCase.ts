export function camelCase(value: string): string {
  return value.charAt(0).toLowerCase() + value.slice(1)
}
