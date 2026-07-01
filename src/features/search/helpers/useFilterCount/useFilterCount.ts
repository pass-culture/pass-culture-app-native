import { useAccessibilityFiltersContext } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { SearchState } from 'features/search/types'

export const useFilterCount = (searchState: SearchState): number => {
  const {
    offerCategories,
    minPrice,
    maxPrice,
    offerIsDuo,
    date,
    timeRange,
    venue,
    beginningDatetime,
    endingDatetime,
  } = searchState
  const { disabilities } = useAccessibilityFiltersContext()
  const hasCategories = offerCategories?.length > 0
  const hasPriceFilter = !!minPrice || !!maxPrice
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
    +hasPriceFilter +
    // Uniquement les offres duo
    +offerIsDuo +
    // Date & heure
    +hasDatesHours + //
    +hasActivatedAccessibility
  )
}
