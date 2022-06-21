import { LocationType } from 'features/search/enums'
import { PartialSearchState } from 'features/search/types'
import { GeoCoordinates } from 'libs/geolocation'

import { RADIUS_FILTERS } from '../enums'

import { buildFacetFilters } from './fetchAlgolia.facetFilters'
import { buildNumericFilters } from './fetchAlgolia.numericFilters'

// We don't use all the fields indexed. Simply retrieve the one we use.
// see SearchHit
export const offerAttributesToRetrieve = [
  'offer.dates',
  'offer.isDigital',
  'offer.isDuo',
  'offer.isEducational',
  'offer.name',
  'offer.prices',
  'offer.subcategoryId',
  'offer.thumbUrl',
  'objectID',
  '_geoloc',
]

export const buildOfferSearchParameters = (
  {
    beginningDatetime = null,
    date = null,
    endingDatetime = null,
    locationFilter,
    offerCategories = [],
    offerSubcategories = [],
    objectIds = [],
    offerIsDuo = false,
    offerIsFree = false,
    offerIsNew = false,
    offerTypes = {
      isDigital: false,
      isEvent: false,
      isThing: false,
    },
    priceRange = null,
    timeRange = null,
    tags = [],
  }: PartialSearchState & { objectIds?: string[] },
  userLocation: GeoCoordinates | null,
  isUserUnderage: boolean
) => ({
  ...buildFacetFilters({
    locationFilter,
    offerCategories,
    offerSubcategories,
    objectIds,
    offerTypes,
    offerIsDuo,
    tags,
    isUserUnderage,
  }),
  ...buildNumericFilters({
    beginningDatetime,
    date,
    endingDatetime,
    offerIsFree,
    offerIsNew,
    priceRange,
    timeRange,
  }),
  ...buildGeolocationParameter(locationFilter, userLocation),
})

export const buildGeolocationParameter = (
  locationFilter: PartialSearchState['locationFilter'],
  userLocation: GeoCoordinates | null
): { aroundLatLng: string; aroundRadius: 'all' | number } | undefined => {
  if (locationFilter.locationType === LocationType.VENUE) return

  if (locationFilter.locationType === LocationType.PLACE) {
    if (!locationFilter.place.geolocation) return
    return {
      aroundLatLng: `${locationFilter.place.geolocation.latitude}, ${locationFilter.place.geolocation.longitude}`,
      aroundRadius: computeAroundRadiusInMeters(
        locationFilter.aroundRadius,
        locationFilter.locationType
      ),
    }
  }

  if (!userLocation) return
  if (locationFilter.locationType === LocationType.EVERYWHERE) {
    return {
      aroundLatLng: `${userLocation.latitude}, ${userLocation.longitude}`,
      aroundRadius: 'all',
    }
  }

  return {
    aroundLatLng: `${userLocation.latitude}, ${userLocation.longitude}`,
    aroundRadius: computeAroundRadiusInMeters(
      locationFilter.aroundRadius,
      locationFilter.locationType
    ),
  }
}

const computeAroundRadiusInMeters = (
  aroundRadius: number | null,
  locationType: LocationType
): number | 'all' => {
  if (locationType === LocationType.EVERYWHERE) return RADIUS_FILTERS.UNLIMITED_RADIUS
  if (aroundRadius === null) return RADIUS_FILTERS.UNLIMITED_RADIUS
  if (aroundRadius === 0) return RADIUS_FILTERS.RADIUS_IN_METERS_FOR_NO_OFFERS
  return aroundRadius * 1000
}
