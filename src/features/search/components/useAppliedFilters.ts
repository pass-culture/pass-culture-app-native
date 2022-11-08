import { useSearch } from 'features/search/pages/SearchWrapper'
import { getPriceAsNumber } from 'features/search/utils/getPriceAsNumber'

export enum FILTER_TYPES {
  LOCATION = 'Localisation',
  CATEGORIES = 'Catégories',
  PRICES = 'Prix',
  OFFER_TYPE = 'Type',
  DATES_HOURS = 'Dates & heures',
}

export const useAppliedFilters = () => {
  const { searchState } = useSearch()
  const { offerCategories, minPrice, maxPrice, offerIsDuo, offerTypes, date, timeRange } =
    searchState
  let filterTypes: FILTER_TYPES[] = [FILTER_TYPES.LOCATION]

  const hasCategory = offerCategories.length > 0
  const minPriceAsNumber: number | undefined = getPriceAsNumber(minPrice)
  const maxPriceAsNumber: number | undefined = getPriceAsNumber(maxPrice)
  const hasPrice =
    (minPriceAsNumber !== undefined && minPriceAsNumber > 0) || maxPriceAsNumber !== undefined
  const hasType = offerIsDuo || offerTypes?.isDigital || offerTypes?.isEvent || offerTypes?.isThing
  const hasDatesHours = Boolean(date || timeRange)

  if (hasCategory) {
    filterTypes = [...filterTypes, FILTER_TYPES.CATEGORIES]
  } else if (hasPrice) {
    filterTypes = [...filterTypes, FILTER_TYPES.PRICES]
  } else if (hasType) {
    filterTypes = [...filterTypes, FILTER_TYPES.OFFER_TYPE]
  } else if (hasDatesHours) {
    filterTypes = [...filterTypes, FILTER_TYPES.DATES_HOURS]
  }

  return filterTypes
}
