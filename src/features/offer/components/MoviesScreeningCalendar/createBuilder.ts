import { cloneDeep } from 'lodash'

import { NumberRange } from 'types'

type Builder<T> = {
  [K in keyof T as `with${Capitalize<string & K>}`]-?: (value: T[K]) => Builder<T>
} & { build: () => T }

export function createBuilder<T>(defaultValues: T): () => Builder<T> {
  const builder = () => {
    const values = cloneDeep(defaultValues)
    const builderObject = {
      build: () => values,
    } as Builder<T>

    for (const key of Object.keys(defaultValues as Record<string, unknown>)) {
      const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1)
      const setterName = `with${capitalizedKey}` as keyof Builder<T>

      builderObject[setterName] = ((value: never) => {
        values[key as keyof T] = value
        return builderObject
      }) as never
    }

    return builderObject
  }

  return builder
}

export const createDateBuilder = (defaultDate = '2024-01-01T00:00:00Z') => {
  const builder = () => {
    const date = new Date(defaultDate)

    const builderObject = {
      withDay: (day: NumberRange<0, 31>) => {
        date.setDate(day)
        return builderObject
      },
      withMonth: (month: NumberRange<0, 12>) => {
        date.setMonth(month)
        return builderObject
      },
      withYear: (year: number) => {
        date.setFullYear(year)
        return builderObject
      },
      toString: () => date.toISOString(),
    }

    return builderObject
  }

  return builder
}
