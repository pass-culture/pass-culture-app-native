import { GetObjectsResponse, MultipleQueriesResponse } from '@algolia/client-search'
import algoliasearch from 'algoliasearch'

import { LocationType } from 'features/search/enums'
import { Response } from 'features/search/pages/useSearchResults'
import { PartialSearchState } from 'features/search/types'
import { SearchParametersQuery } from 'libs/algolia/types'
import { env } from 'libs/environment'
import { GeoCoordinates } from 'libs/geolocation'

import { AlgoliaHit } from '../algolia.d'
import { RADIUS_FILTERS } from '../enums'
import { buildFacetFilters } from '../fetchAlgolia/fetchAlgolia.facetFilters'
import { buildNumericFilters } from '../fetchAlgolia/fetchAlgolia.numericFilters'

const client = algoliasearch(env.ALGOLIA_APPLICATION_ID, env.ALGOLIA_SEARCH_API_KEY)

// We don't use all the fields indexed. Simply retrieve the one we use.
// see SearchHit
export const attributesToRetrieve = [
  'offer.category',
  'offer.dates',
  'offer.description',
  'offer.isDigital',
  'offer.isDuo',
  'offer.name',
  'offer.prices',
  'offer.thumbUrl',
  'objectID',
  '_geoloc',
]

const buildSearchParameters = (
  {
    beginningDatetime = null,
    date = null,
    endingDatetime = null,
    locationFilter,
    offerCategories = [],
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
  }: PartialSearchState,
  userLocation: GeoCoordinates | null
) => ({
  ...buildFacetFilters({ offerCategories, offerTypes, offerIsDuo, tags }),
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

export const fetchMultipleAlgolia = (
  paramsList: PartialSearchState[],
  userLocation: GeoCoordinates | null
): Readonly<Promise<MultipleQueriesResponse<AlgoliaHit>>> => {
  const queries = paramsList.map((params) => ({
    indexName: env.ALGOLIA_INDEX_NAME,
    query: params.query,
    params: {
      ...buildHitsPerPage(params.hitsPerPage),
      ...buildSearchParameters(params, userLocation),
      attributesToHighlight: [], // We disable highlighting because we don't need it
      attributesToRetrieve,
    },
  }))

  return client.multipleQueries(queries)
}

export const fetchAlgolia = (
  parameters: SearchParametersQuery,
  userLocation: GeoCoordinates | null
): Readonly<Promise<Response>> => {
  const searchParameters = buildSearchParameters(parameters, userLocation)
  const index = client.initIndex(env.ALGOLIA_INDEX_NAME)

  return index.search(parameters.query || '', {
    page: parameters.page || 0,
    ...buildHitsPerPage(parameters.hitsPerPage),
    ...searchParameters,
    attributesToRetrieve,
    attributesToHighlight: [], // We disable highlighting because we don't need it
  })
}

export const fetchAlgoliaHits = (
  objectIds: string[]
): Readonly<Promise<GetObjectsResponse<AlgoliaHit>>> => {
  const index = client.initIndex(env.ALGOLIA_INDEX_NAME)
  return index.getObjects(objectIds, { attributesToRetrieve })
}

const buildHitsPerPage = (hitsPerPage: PartialSearchState['hitsPerPage']) =>
  hitsPerPage ? { hitsPerPage } : null

const buildGeolocationParameter = (
  locationFilter: PartialSearchState['locationFilter'],
  userLocation: GeoCoordinates | null
): { aroundLatLng: string; aroundRadius: 'all' | number } | undefined => {
  if (locationFilter.locationType === LocationType.VENUE) return

  if (locationFilter.locationType === LocationType.PLACE) {
    if (!locationFilter.place.geolocation) return
    return {
      aroundLatLng: `${locationFilter.place.geolocation.latitude}, ${locationFilter.place.geolocation.longitude}`,
      aroundRadius: computeAroudRadiusInMeters(
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
    aroundRadius: computeAroudRadiusInMeters(
      locationFilter.aroundRadius,
      locationFilter.locationType
    ),
  }
}

const computeAroudRadiusInMeters = (
  aroundRadius: number | null,
  locationType: LocationType
): number | 'all' => {
  if (locationType === LocationType.EVERYWHERE) return RADIUS_FILTERS.UNLIMITED_RADIUS
  if (aroundRadius === null) return RADIUS_FILTERS.UNLIMITED_RADIUS
  if (aroundRadius === 0) return RADIUS_FILTERS.RADIUS_IN_METERS_FOR_NO_OFFERS
  return aroundRadius * 1000
}
