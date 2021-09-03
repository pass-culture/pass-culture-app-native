import { SearchParametersFields } from 'features/home/contentful'
import { LocationType, OptionalCategoryCriteria } from 'features/search/enums'
import { SearchState } from 'features/search/types'
import { GeoCoordinates } from 'libs/geolocation'

export const parseSearchParameters = (
  {
    geolocation,
    parameters,
  }: {
    geolocation: GeoCoordinates | null
    parameters: SearchParametersFields
  },
  availableCategories: OptionalCategoryCriteria
): Partial<SearchState> | undefined => {
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
    aroundRadius: aroundRadius || null,
    beginningDatetime: beginningDatetime,
    endingDatetime: endingDatetime,
    geolocation: geolocation
      ? {
          latitude: geolocation.latitude,
          longitude: geolocation.longitude,
        }
      : null,
    hitsPerPage: parameters.hitsPerPage || null,
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
    locationType: isGeolocated ? LocationType.AROUND_ME : LocationType.EVERYWHERE,
    tags: parameters.tags || [],
    date: null,
    timeRange: null,
    venueId: null,
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
