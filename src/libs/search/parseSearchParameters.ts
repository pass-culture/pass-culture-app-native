import { computeBeginningAndEndingDatetimes } from 'features/home/api/helpers/computeBeginningAndEndingDatetimes'
import { OffersModuleParameters } from 'features/home/types'
import { LocationType } from 'features/search/enums'
import { sortCategories } from 'features/search/helpers/reducer.helpers'
import { SearchState, SearchView } from 'features/search/types'
import { getCategoriesFacetFilters } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/getCategoriesFacetFilters'
import { GeoCoordinates } from 'libs/geolocation'
import { buildOfferGenreTypesValues } from 'libs/search/utils/buildOfferGenreTypesValues'
import { GenreTypeMapping, SubcategoryLabelMapping } from 'libs/subcategories/types'

export const parseGeolocationParameters = (
  geolocation: GeoCoordinates | null,
  isGeolocated?: boolean,
  aroundRadius?: number
): SearchState['locationFilter'] | undefined => {
  const notGeolocatedButRadiusIsProvided = !isGeolocated && aroundRadius
  const geolocatedButGeolocationIsInvalid = isGeolocated && !geolocation

  if (notGeolocatedButRadiusIsProvided || geolocatedButGeolocationIsInvalid) return

  return isGeolocated && geolocation
    ? { locationType: LocationType.AROUND_ME, aroundRadius: aroundRadius || null }
    : { locationType: LocationType.EVERYWHERE }
}

export const parseSearchParameters = (
  parameters: OffersModuleParameters,
  geolocation: GeoCoordinates | null,
  subcategoryLabelMapping: SubcategoryLabelMapping,
  genreTypeMapping: GenreTypeMapping
): SearchState | undefined => {
  const { aroundRadius, isGeolocated, priceMin, priceMax } = parameters

  const locationFilter = parseGeolocationParameters(geolocation, isGeolocated, aroundRadius)
  if (!locationFilter) return

  const { beginningDatetime, endingDatetime } = computeBeginningAndEndingDatetimes({
    beginningDatetime: parameters.beginningDatetime,
    endingDatetime: parameters.endingDatetime,
    eventDuringNextXDays: parameters.eventDuringNextXDays,
    upcomingWeekendEvent: parameters.upcomingWeekendEvent,
    currentWeekEvent: parameters.currentWeekEvent,
  })

  // We receive category labels from contentful. We first have to map to facetFilters used for search
  const offerCategories = (parameters.categories || [])
    .map(getCategoriesFacetFilters)
    .sort(sortCategories)

  const offerSubcategories = (parameters.subcategories || []).map(
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
    hitsPerPage: parameters.hitsPerPage || null,
    locationFilter,
    offerCategories,
    offerSubcategories,
    offerIsDuo: parameters.isDuo || false,
    offerIsNew: parameters.newestOnly || false,
    offerTypes: {
      isDigital: parameters.isDigital || false,
      isEvent: parameters.isEvent || false,
      isThing: parameters.isThing || false,
    },
    priceRange: _buildPriceRange({ priceMin, priceMax }),
    tags: parameters.tags || [],
    date: null,
    timeRange: null,
    query: '',
    view: SearchView.Landing,
    minBookingsThreshold: parameters.minBookingsThreshold || 0,
    offerGenreTypes: offerGenreTypes,
  }
}

const _buildPriceRange = ({ priceMin = 0, priceMax = 300 }): [number, number] => {
  return [priceMin, priceMax]
}
