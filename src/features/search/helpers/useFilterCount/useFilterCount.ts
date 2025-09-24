import { useAccessibilityFiltersContext } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { getPriceAsNumber } from 'features/search/helpers/getPriceAsNumber/getPriceAsNumber'
import { SearchState } from 'features/search/types'

export const useFilterCount = (searchState: SearchState): number => {
  const {
    offerCategories,
    minPrice,
    maxPrice,
    offerIsFree,
    offerIsDuo,
    date,
    timeRange,
    venue,
    beginningDatetime,
    endingDatetime,
    priceRange,
  } = searchState
  const { disabilities } = useAccessibilityFiltersContext()
  const hasCategories = offerCategories?.length > 0
  const minPriceAsNumber = getPriceAsNumber(minPrice)
  const maxPriceAsNumber = getPriceAsNumber(maxPrice)
  const hasPricesOrFree =
    (!!minPriceAsNumber && minPriceAsNumber > 0) ||
    !!maxPriceAsNumber ||
    !!priceRange ||
    !!offerIsFree
  const hasActivatedAccessibility =
    !!disabilities.isMentalDisabilityCompliant ||
    !!disabilities.isMotorDisabilityCompliant ||
    !!disabilities.isVisualDisabilityCompliant ||
    !!disabilities.isAudioDisabilityCompliant
  const hasDatesHours = Boolean(date ?? timeRange ?? beginningDatetime ?? endingDatetime)

  return (
    // Lieux culturels
    +!!venue +
    // Catégories
    +hasCategories +
    // Prix ou gratuit
    +hasPricesOrFree +
    // Uniquement les offres duo
    +offerIsDuo +
    // Date & heure
    +hasDatesHours + //
    +hasActivatedAccessibility
  )
}
