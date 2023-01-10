import { LocationType } from 'features/search/enums'
import { useMaxPrice } from 'features/search/helpers/useMaxPrice/useMaxPrice'
import { SearchState } from 'features/search/types'

export const useFilterCount = (searchState: SearchState): number => {
  const {
    locationFilter,
    offerCategories,
    offerIsDuo,
    offerIsFree,
    offerIsNew,
    date,
    timeRange,
    priceRange,
  } = searchState

  const maxPrice = useMaxPrice()
  const currentPriceRange = priceRange ?? [0, maxPrice]
  return (
    // Localisation
    +(locationFilter.locationType !== LocationType.EVERYWHERE) +
    // Catégories
    offerCategories.length +
    // Prix
    +(currentPriceRange[0] > 0 || currentPriceRange[1] < maxPrice) +
    // Uniquement les offres gratuites
    +(offerIsFree ?? false) +
    // Uniquement les offres duo
    +offerIsDuo +
    // Uniquement les nouveautés
    +offerIsNew +
    // Date
    +!!date +
    // Heure
    +!!timeRange
  )
}
