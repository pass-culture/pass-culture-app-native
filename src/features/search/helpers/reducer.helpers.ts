import { SearchGroupNameEnumv2 } from 'api/gen'

export const MAX_PRICE_IN_CENTS = 300_00
export const MAX_RADIUS = 100
export const DEFAULT_TIME_RANGE = [8, 24]

export const sortCategories = (a: SearchGroupNameEnumv2, b: SearchGroupNameEnumv2) =>
  a.localeCompare(b)
