import { LocationType } from 'features/search/enums'
import { clampPrice } from 'features/search/pages/reducer.helpers'
import { RecursivePartial, SearchState } from 'features/search/types'

export const sanitizedSearchStateRequiredDefaults = {
  geolocation: null,
  offerCategories: [],
  query: '',
  tags: [],
}

export const sanitizeSearchStateParams = (searchState: RecursivePartial<SearchState> = {}) => {
  const {
    aroundRadius,
    beginningDatetime,
    date,
    endingDatetime,
    geolocation,
    hitsPerPage,
    locationType,
    offerCategories,
    offerTypes,
    offerIsDuo,
    offerIsFree,
    offerIsNew,
    place,
    query,
    showResults,
    tags,
    timeRange,
    venueId,
  } = searchState
  const priceRange = clampPrice(searchState.priceRange)

  return {
    ...(aroundRadius ? { aroundRadius } : {}),
    ...(beginningDatetime ? { beginningDatetime } : {}),
    ...(date ? { date } : {}),
    ...(endingDatetime ? { endingDatetime } : {}),
    geolocation: geolocation || sanitizedSearchStateRequiredDefaults.geolocation,
    ...(hitsPerPage ? { hitsPerPage } : {}),
    ...(locationType !== LocationType.EVERYWHERE ? { locationType } : {}),
    offerCategories: offerCategories || sanitizedSearchStateRequiredDefaults.offerCategories,
    ...(offerIsDuo ? { offerIsDuo } : {}),
    ...(offerIsFree ? { offerIsFree } : {}),
    ...(offerIsNew ? { offerIsNew } : {}),
    ...(offerTypes?.isDigital || offerTypes?.isEvent || offerTypes?.isThing
      ? {
          offerTypes: {
            ...(offerTypes?.isDigital ? { isDigital: offerTypes?.isDigital } : {}),
            ...(offerTypes?.isEvent ? { isEvent: offerTypes?.isEvent } : {}),
            ...(offerTypes?.isThing ? { isThing: offerTypes?.isThing } : {}),
          },
        }
      : {}),
    ...(place ? { place } : {}),
    ...(searchState.priceRange ? { priceRange } : {}),
    query: query || sanitizedSearchStateRequiredDefaults.query,
    ...(showResults ? { showResults } : {}),
    tags: tags || sanitizedSearchStateRequiredDefaults.tags,
    ...(timeRange ? { timeRange } : {}),
    ...(venueId ? { venueId } : {}),
  }
}
