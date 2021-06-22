import { GeoCoordinates } from 'react-native-geolocation-service'

import { SearchParametersFields } from 'features/home/contentful'
import { LocationType, CATEGORY_CRITERIA } from 'features/search/enums'
import { SearchParameters } from 'features/search/types'

export const parseAlgoliaParameters = ({
  geolocation,
  parameters,
}: {
  geolocation: GeoCoordinates | null
  parameters: SearchParametersFields
}): SearchParameters | null => {
  const { aroundRadius, isGeolocated, priceMin, priceMax } = parameters

  const notGeolocatedButRadiusIsProvided = !isGeolocated && aroundRadius
  const geolocatedButGeolocationIsInvalid = isGeolocated && !geolocation

  if (notGeolocatedButRadiusIsProvided || geolocatedButGeolocationIsInvalid) {
    return null
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
    offerCategories: _buildCategories(parameters.categories || []),
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
  }
}

const _buildPriceRange = ({ priceMin = 0, priceMax = 300 }): [number, number] => {
  return [priceMin, priceMax]
}

const _buildCategories = (categoriesLabel: string[]): string[] => {
  return Object.values(CATEGORY_CRITERIA)
    .filter((categoryCriterion) => categoriesLabel.includes(categoryCriterion.label))
    .map((categoryCriterion) => categoryCriterion.facetFilter)
}
