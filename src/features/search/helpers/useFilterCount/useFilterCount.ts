import { SearchState } from 'features/search/types'
import { useGeolocation } from 'libs/geolocation'

export const useFilterCount = (searchState: SearchState): number => {
  const { offerCategories, minPrice, maxPrice, offerIsFree, offerIsDuo, date, timeRange } =
    searchState
  const { position } = useGeolocation()
  const hasCategories = offerCategories.length > 0
  const hasPrices = ((!!minPrice && Number(minPrice) > 0) || !!maxPrice) && !offerIsFree
  const hasActivatedFreeOffer = offerIsFree ?? false

  return (
    // Localisation
    +!!position +
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
    +!!timeRange
  )
}
