export type NoNullProperties<T> = { [K in keyof T]: Exclude<T[K], null> }
export type Range<T> = [T, T]
