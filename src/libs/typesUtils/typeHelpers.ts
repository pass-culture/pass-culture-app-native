export type NoNullProperties<T> = { [K in keyof T]: Exclude<T[K], null> }
export type Range<T> = [T, T]
export type RequireField<T, K extends keyof T> = T & Required<Pick<T, K>>
