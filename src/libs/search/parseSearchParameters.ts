import { SearchParametersFields } from 'features/home/contentful'
import { LocationType, OptionalCategoryCriteria } from 'features/search/enums'
import { SearchState } from 'features/search/types'
import { GeoCoordinates } from 'libs/geolocation'

export const parseSearchParameters = (
  parameters: SearchParametersFields,
  geolocation: GeoCoordinates | null,
  availableCategories: OptionalCategoryCriteria
): SearchState | undefined => {
  const { aroundRadius, isGeolocated, priceMin, priceMax } = parameters

  const notGeolocatedButRadiusIsProvided = !isGeolocated && aroundRadius
  const geolocatedButGeolocationIsInvalid = isGeolocated && !geolocation

  if (notGeolocatedButRadiusIsProvided || geolocatedButGeolocationIsInvalid) {
    return undefined
  }

  const beginningDatetime = parameters.beginningDatetime
    ? new Date(parameters.beginningDatetime)
    : null

  const endingDatetime = parameters.endingDatetime ? new Date(parameters.endingDatetime) : null

  return {
    beginningDatetime: beginningDatetime,
    endingDatetime: endingDatetime,
    hitsPerPage: parameters.hitsPerPage || null,
    locationFilter:
      isGeolocated && geolocation
        ? { locationType: LocationType.AROUND_ME, aroundRadius: aroundRadius || null }
        : { locationType: LocationType.EVERYWHERE },
    offerCategories: _buildCategories(parameters.categories || [], availableCategories),
    offerIsDuo: parameters.isDuo || false,
    offerIsFree: parameters.isFree || false,
    offerIsNew: parameters.newestOnly || false,
    offerTypes: {
      isDigital: parameters.isDigital || false,
      isEvent: parameters.isEvent || false,
      isThing: parameters.isThing || false,
    },
    priceRange: _buildPriceRange({ priceMin, priceMax }),
    showResults: false,
    tags: parameters.tags || [],
    date: null,
    timeRange: null,
    query: '',
  }
}

const _buildPriceRange = ({ priceMin = 0, priceMax = 300 }): [number, number] => {
  return [priceMin, priceMax]
}

const _buildCategories = (
  categoriesLabel: string[],
  availableCategories: OptionalCategoryCriteria
): string[] => {
  return Object.values(availableCategories)
    .filter((categoryCriterion) => categoriesLabel.includes(categoryCriterion.label))
    .map((categoryCriterion) => categoryCriterion.facetFilter)
}
