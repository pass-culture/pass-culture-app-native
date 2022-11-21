import { getPriceAsNumber } from 'features/search/helpers/getPriceAsNumber/getPriceAsNumber'
import { SearchState } from 'features/search/types'

export enum FILTER_TYPES {
  LOCATION = 'Localisation',
  CATEGORIES = 'Catégories',
  PRICES = 'Prix',
  OFFER_TYPE = 'Type',
  DATES_HOURS = 'Dates & heures',
}

export const useAppliedFilters = (searchState: Partial<SearchState>) => {
  const { offerCategories, minPrice, maxPrice, offerIsDuo, offerTypes, date, timeRange } =
    searchState
  let filterTypes: FILTER_TYPES[] = [FILTER_TYPES.LOCATION]

  const hasCategory = offerCategories ? offerCategories.length > 0 : false
  const minPriceAsNumber: number | undefined = getPriceAsNumber(minPrice)
  const maxPriceAsNumber: number | undefined = getPriceAsNumber(maxPrice)
  const hasPrice =
    (minPriceAsNumber !== undefined && minPriceAsNumber > 0) || maxPriceAsNumber !== undefined
  const hasType = offerIsDuo || offerTypes?.isDigital || offerTypes?.isEvent || offerTypes?.isThing
  const hasDatesHours = Boolean(date || timeRange)

  if (hasCategory) {
    filterTypes = [...filterTypes, FILTER_TYPES.CATEGORIES]
  }
  if (hasPrice) {
    filterTypes = [...filterTypes, FILTER_TYPES.PRICES]
  }
  if (hasType) {
    filterTypes = [...filterTypes, FILTER_TYPES.OFFER_TYPE]
  }
  if (hasDatesHours) {
    filterTypes = [...filterTypes, FILTER_TYPES.DATES_HOURS]
  }

  return filterTypes
}
