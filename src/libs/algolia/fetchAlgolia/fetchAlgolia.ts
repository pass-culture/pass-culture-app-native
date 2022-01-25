import { Hit } from '@algolia/client-search'
import flatten from 'lodash.flatten'

import { LocationType } from 'features/search/enums'
import { initialSearchState } from 'features/search/pages/reducer'
import { Response } from 'features/search/pages/useSearchResults'
import { PartialSearchState } from 'features/search/types'
import { captureAlgoliaError } from 'libs/algolia/fetchAlgolia/AlgoliaError'
import { client } from 'libs/algolia/fetchAlgolia/clients'
import { buildHitsPerPage } from 'libs/algolia/fetchAlgolia/utils'
import { SearchParametersQuery } from 'libs/algolia/types'
import { env } from 'libs/environment'
import { GeoCoordinates } from 'libs/geolocation'
import { SearchHit } from 'libs/search'

import { RADIUS_FILTERS } from '../enums'
import { buildFacetFilters } from '../fetchAlgolia/fetchAlgolia.facetFilters'
import { buildNumericFilters } from '../fetchAlgolia/fetchAlgolia.numericFilters'

// We don't use all the fields indexed. Simply retrieve the one we use.
// see SearchHit
export const attributesToRetrieve = [
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

const buildSearchParameters = (
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

export const fetchMultipleAlgolia = async (
  paramsList: PartialSearchState[],
  userLocation: GeoCoordinates | null,
  isUserUnderage: boolean
): Promise<{ hits: SearchHit[]; nbHits: number }> => {
  const queries = paramsList.map((params) => ({
    indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
    query: params.query,
    params: {
      ...buildHitsPerPage(params.hitsPerPage),
      ...buildSearchParameters(params, userLocation, isUserUnderage),
      attributesToHighlight: [], // We disable highlighting because we don't need it
      attributesToRetrieve,
    },
  }))

  try {
    const response = await client.multipleQueries<SearchHit>(queries)
    const { results } = response

    return {
      hits: flatten(results.map(({ hits }) => hits)),
      nbHits: results.reduce((prev, curr) => prev + curr.nbHits, 0),
    }
  } catch (error) {
    captureAlgoliaError(error)
    return { hits: [] as SearchHit[], nbHits: 0 }
  }
}

export const fetchAlgolia = async (
  parameters: SearchParametersQuery,
  userLocation: GeoCoordinates | null,
  isUserUnderage: boolean
): Promise<Response> => {
  const searchParameters = buildSearchParameters(parameters, userLocation, isUserUnderage)
  const index = client.initIndex(env.ALGOLIA_OFFERS_INDEX_NAME)

  try {
    const response = await index.search<SearchHit>(parameters.query || '', {
      page: parameters.page || 0,
      ...buildHitsPerPage(parameters.hitsPerPage),
      ...searchParameters,
      attributesToRetrieve,
      attributesToHighlight: [], // We disable highlighting because we don't need it
    })
    return response
  } catch (error) {
    captureAlgoliaError(error)
    return { hits: [] as Hit<SearchHit>[], nbHits: 0, page: 0, nbPages: 0 }
  }
}

export const fetchAlgoliaHits = async (
  objectIds: string[],
  isUserUnderage: boolean
): Promise<SearchHit[]> => {
  const index = client.initIndex(env.ALGOLIA_OFFERS_INDEX_NAME)
  const searchParameters = buildSearchParameters(
    { ...initialSearchState, hitsPerPage: objectIds.length, objectIds, query: '' },
    null,
    isUserUnderage
  )

  try {
    const response = await index.search<SearchHit>('', {
      page: 0,
      hitsPerPage: objectIds.length,
      ...searchParameters,
      attributesToRetrieve,
      attributesToHighlight: [], // We disable highlighting because we don't need it
    })
    const hits = response.hits.filter(Boolean) as SearchHit[]
    return hits.filter(({ offer }) => !offer.isEducational)
  } catch (error) {
    captureAlgoliaError(error)
    return [] as SearchHit[]
  }
}

export const buildGeolocationParameter = (
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
