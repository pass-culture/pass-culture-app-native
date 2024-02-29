import { useAccessibilityFiltersContext } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { getPriceAsNumber } from 'features/search/helpers/getPriceAsNumber/getPriceAsNumber'
import { SearchState } from 'features/search/types'

export enum FILTER_TYPES {
  LOCATION = 'Localisation',
  CATEGORIES = 'Catégories',
  PRICES = 'Prix',
  OFFER_DUO = 'Duo',
  DATES_HOURS = 'Dates & heures',
  ACCESSIBILITY = 'Lieux accessibles',
}

export const useAppliedFilters = (searchState: Partial<SearchState>) => {
  const { offerCategories, minPrice, maxPrice, offerIsDuo, date, timeRange } = searchState
  const { disabilities } = useAccessibilityFiltersContext()
  let filterTypes: FILTER_TYPES[] = [FILTER_TYPES.LOCATION]

  const hasCategory = offerCategories ? offerCategories.length > 0 : false
  const minPriceAsNumber: number | undefined = getPriceAsNumber(minPrice)
  const maxPriceAsNumber: number | undefined = getPriceAsNumber(maxPrice)
  const hasPrice =
    (minPriceAsNumber !== undefined && minPriceAsNumber > 0) || maxPriceAsNumber !== undefined
  const hasDuoOffer = offerIsDuo
  const hasDatesHours = Boolean(date ?? timeRange)
  const hasDisabilitySelected =
    Object.values(disabilities).filter((disability) => disability).length > 0
  if (hasCategory) {
    filterTypes = [...filterTypes, FILTER_TYPES.CATEGORIES]
  }
  if (hasPrice) {
    filterTypes = [...filterTypes, FILTER_TYPES.PRICES]
  }
  if (hasDuoOffer) {
    filterTypes = [...filterTypes, FILTER_TYPES.OFFER_DUO]
  }
  if (hasDatesHours) {
    filterTypes = [...filterTypes, FILTER_TYPES.DATES_HOURS]
  }
  if (hasDisabilitySelected) {
    filterTypes = [...filterTypes, FILTER_TYPES.ACCESSIBILITY]
  }

  return filterTypes
}
