import { useAccessibilityFiltersContext } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { SearchState } from 'features/search/types'

export const useFilterCount = (searchState: SearchState): number => {
  const { offerCategories, minPrice, maxPrice, offerIsFree, offerIsDuo, date, timeRange, venue } =
    searchState
  const { disabilities } = useAccessibilityFiltersContext()
  const hasCategories = offerCategories.length > 0
  const hasPrices = ((!!minPrice && Number(minPrice) > 0) || !!maxPrice) && !offerIsFree
  const hasActivatedFreeOffer = offerIsFree ?? false
  const hasActivatedAccessibility =
    !!disabilities.isMentalDisabilityCompliant ||
    !!disabilities.isMotorDisabilityCompliant ||
    !!disabilities.isVisualDisabilityCompliant ||
    !!disabilities.isAudioDisabilityCompliant

  return (
    // Lieux culturels
    +!!venue +
    // Catégories
    +hasCategories +
    // Prix
    +hasPrices +
    // Uniquement les offres gratuites
    +hasActivatedFreeOffer +
    // Uniquement les offres duo
    +offerIsDuo +
    // Date
    +!!date +
    // Heure
    +!!timeRange +
    //
    +hasActivatedAccessibility
  )
}
