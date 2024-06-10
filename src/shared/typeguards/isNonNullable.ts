export const isNonNullable = <T>(value: T): value is NonNullable<T> => {
  return !!value
}
