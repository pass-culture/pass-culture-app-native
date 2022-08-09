import { SearchGroupNameEnumv2 } from 'api/gen'
import { Range } from 'libs/typesUtils/typeHelpers'

export const MIN_PRICE = 0
export const MAX_PRICE = 300
export const MAX_RADIUS = 100
export const DEFAULT_TIME_RANGE = [8, 24]

export const clampPrice = (priceRange: Range<number> | null | undefined): Range<number> => {
  if (!priceRange) return [MIN_PRICE, MAX_PRICE]
  const min = Math.max(MIN_PRICE, priceRange[0])
  const max = Math.min(MAX_PRICE, priceRange[1])
  return [min, max]
}

export const addOrRemove = (array: SearchGroupNameEnumv2[], element: SearchGroupNameEnumv2) => {
  if (array.includes(element)) return array.filter((el) => el !== element)
  return [...array, element]
}

export const sortCategories = (a: SearchGroupNameEnumv2, b: SearchGroupNameEnumv2) =>
  a.localeCompare(b)
