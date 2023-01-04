import { computeBeginningAndEndingDatetimes } from 'features/home/api/helpers/computeBeginningAndEndingDatetimes'
import { LocationType } from 'features/search/enums'
import { sortCategories } from 'features/search/helpers/reducer.helpers'
import { SearchState, SearchView } from 'features/search/types'
import { SearchParametersFields } from 'libs/contentful'
import { GeoCoordinates } from 'libs/geolocation'
import { getCategoriesFacetFilters } from 'libs/search/utils'
import { SubcategoryLabelMapping } from 'libs/subcategories/types'

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
  parameters: SearchParametersFields,
  geolocation: GeoCoordinates | null,
  subcategoryLabelMapping: SubcategoryLabelMapping
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
  }
}

const _buildPriceRange = ({ priceMin = 0, priceMax = 300 }): [number, number] => {
  return [priceMin, priceMax]
}
