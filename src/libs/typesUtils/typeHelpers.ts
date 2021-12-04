export type NoNullProperties<T> = { [K in keyof T]: Exclude<T[K], null> }

export type Range<T> = [T, T]

export type RequireField<T, K extends keyof T> = T & Required<Pick<T, K>>

export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never
