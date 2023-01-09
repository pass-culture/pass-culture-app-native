import { LocationType } from 'features/search/enums'
import { useMaxPrice } from 'features/search/helpers/useMaxPrice/useMaxPrice'
import { SearchState } from 'features/search/types'

export const useFilterCount = (searchState: SearchState): number => {
  const { offerTypes, locationFilter } = searchState

  const maxPrice = useMaxPrice()
  const priceRange = searchState.priceRange ?? [0, maxPrice]
  return (
    // Localisation
    +(locationFilter.locationType !== LocationType.EVERYWHERE) +
    // Catégories
    searchState.offerCategories.length +
    // Type d'offre
    (+offerTypes['isDigital'] + +offerTypes['isEvent'] + +offerTypes['isThing']) +
    // Prix
    +(priceRange[0] > 0 || priceRange[1] < maxPrice) +
    // Uniquement les offres gratuites
    +(searchState.offerIsFree ?? false) +
    // Uniquement les offres duo
    +searchState.offerIsDuo +
    // Uniquement les nouveautés
    +searchState.offerIsNew +
    // Date
    +!!searchState.date +
    // Heure
    +!!searchState.timeRange
  )
}
