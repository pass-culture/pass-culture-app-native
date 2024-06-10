export function isString(value: string | null | undefined): value is string {
  return Boolean(value)
}
