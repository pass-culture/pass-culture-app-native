import { SearchState } from 'features/search/pages/reducer'
import { MAX_PRICE } from 'features/search/pages/reducer.helpers'
import { LocationType } from 'libs/algolia'

export const getFilterCount = (searchState: SearchState): number => {
  const { offerTypes } = searchState
  const priceRange = searchState.priceRange ?? [0, MAX_PRICE]

  return (
    // Localisation
    +(searchState.locationType !== LocationType.EVERYWHERE) +
    // Catégories
    searchState.offerCategories.length +
    // Type d'offre
    (+offerTypes['isDigital'] + +offerTypes['isEvent'] + +offerTypes['isThing']) +
    // Prix
    +(priceRange[0] > 0 || priceRange[1] < MAX_PRICE) +
    // Uniquement les offres gratuites
    +searchState.offerIsFree +
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
