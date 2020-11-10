import { GeoCoordinates } from 'react-native-geolocation-service'

import { AlgoliaParametersFields } from 'features/home/contentful'

import { CATEGORY_CRITERIA } from './enums/criteriaEnums'
import { ParsedAlgoliaParameters } from './types'

export const parseAlgoliaParameters = ({
  geolocation,
  parameters,
}: {
  geolocation: GeoCoordinates | null
  parameters: AlgoliaParametersFields
}): ParsedAlgoliaParameters | null => {
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
    searchAround: parameters.isGeolocated || false,
    tags: parameters.tags || [],
  }
}

const _buildPriceRange = ({ priceMin = 0, priceMax = 500 }): [number, number] => {
  return [priceMin, priceMax]
}

const _buildCategories = (categoriesLabel: string[]): string[] => {
  const categories: string[] = []
  Object.values(CATEGORY_CRITERIA).forEach((categoryCriterion) => {
    if (categoriesLabel.includes(categoryCriterion.label)) {
      categories.push(categoryCriterion.facetFilter)
    }
  })
  return categories
}
