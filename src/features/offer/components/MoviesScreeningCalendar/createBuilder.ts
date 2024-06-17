import { cloneDeep } from 'lodash'

type Builder<T> = {
  [K in keyof T as `with${Capitalize<string & K>}`]-?: (value: T[K]) => Builder<T>
} & { build: () => T }

export function createBuilder<T>(defaultValues: T): Builder<T> {
  const values = { ...defaultValues }

  const builder = {
    build: () => cloneDeep(values),
  } as Builder<T>

  for (const key of Object.keys(defaultValues as Record<string, unknown>)) {
    const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1)
    const setterName = `with${capitalizedKey}` as keyof Builder<T>

    builder[setterName] = ((value: never) => {
      values[key as keyof T] = value
      return builder
    }) as never
  }

  return builder
}
