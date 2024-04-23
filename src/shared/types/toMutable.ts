import type { ReadonlyDeep, WritableDeep } from 'type-fest'

export const toMutable = <T>(object: ReadonlyDeep<T>) => {
  return object as WritableDeep<T>
}
