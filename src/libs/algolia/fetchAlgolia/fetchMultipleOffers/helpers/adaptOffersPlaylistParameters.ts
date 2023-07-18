import { computeBeginningAndEndingDatetimes } from 'features/home/api/helpers/computeBeginningAndEndingDatetimes'
import { OffersModuleParameters } from 'features/home/types'
import { sortCategories } from 'features/search/helpers/reducer.helpers'
import { getCategoriesFacetFilters } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/getCategoriesFacetFilters'
import { buildOfferGenreTypesValues } from 'libs/algolia/fetchAlgolia/fetchMultipleOffers/helpers/buildOfferGenreTypesValues'
import { adaptGeolocationParameters } from 'libs/algolia/fetchAlgolia/helpers/adaptGeolocationParameters'
import { SearchQueryParameters } from 'libs/algolia/types'
import { Position } from 'libs/geolocation'
import { GenreTypeMapping, SubcategoryLabelMapping } from 'libs/subcategories/types'

export const adaptOffersPlaylistParameters = (
  parameters: OffersModuleParameters,
  geolocation: Position,
  subcategoryLabelMapping: SubcategoryLabelMapping,
  genreTypeMapping: GenreTypeMapping
): SearchQueryParameters | undefined => {
  const { aroundRadius, isGeolocated, priceMin, priceMax } = parameters

  const locationFilter = adaptGeolocationParameters(geolocation, isGeolocated, aroundRadius)
  if (!locationFilter) return

  const { beginningDatetime, endingDatetime } = computeBeginningAndEndingDatetimes({
    beginningDatetime: parameters.beginningDatetime,
    endingDatetime: parameters.endingDatetime,
    eventDuringNextXDays: parameters.eventDuringNextXDays,
    upcomingWeekendEvent: parameters.upcomingWeekendEvent,
    currentWeekEvent: parameters.currentWeekEvent,
  })

  // We receive category labels from contentful. We first have to map to facetFilters used for search
  const offerCategories = (parameters.categories ?? [])
    .map(getCategoriesFacetFilters)
    .sort(sortCategories)

  const offerSubcategories = (parameters.subcategories ?? []).map(
    (subcategoryLabel) => subcategoryLabelMapping[subcategoryLabel]
  )

  const offerGenreTypes = buildOfferGenreTypesValues(
    {
      bookTypes: parameters.bookTypes,
      movieGenres: parameters.movieGenres,
      musicTypes: parameters.musicTypes,
      showTypes: parameters.showTypes,
    },
    genreTypeMapping
  )

  return {
    beginningDatetime,
    endingDatetime,
    hitsPerPage: parameters.hitsPerPage ?? null,
    locationFilter,
    offerCategories,
    offerSubcategories,
    offerIsDuo: parameters.isDuo ?? false,
    offerIsNew: parameters.newestOnly ?? false,
    offerTypes: {
      isDigital: parameters.isDigital ?? false,
      isEvent: parameters.isEvent ?? false,
      isThing: parameters.isThing ?? false,
    },
    priceRange: _buildPriceRange({ priceMin, priceMax }),
    tags: parameters.tags ?? [],
    date: null,
    timeRange: null,
    query: '',
    minBookingsThreshold: parameters.minBookingsThreshold || 0,
    offerGenreTypes: offerGenreTypes,
  }
}

const _buildPriceRange = ({ priceMin = 0, priceMax = 300 }): [number, number] => {
  return [priceMin, priceMax]
}
