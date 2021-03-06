import { GetObjectsResponse, MultipleQueriesResponse } from '@algolia/client-search'
import algoliasearch from 'algoliasearch'

import { LocationType } from 'features/search/enums'
import { Response } from 'features/search/pages/useSearchResults'
import { SearchParameters } from 'features/search/types'
import { SearchParametersQuery } from 'libs/algolia/types'
import { env } from 'libs/environment'

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

const buildSearchParameters = ({
  aroundRadius = RADIUS_FILTERS.DEFAULT_RADIUS_IN_KILOMETERS,
  beginningDatetime = null,
  date = null,
  endingDatetime = null,
  geolocation = null,
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
  locationType = LocationType.EVERYWHERE,
  timeRange = null,
  tags = [],
}: SearchParameters) => ({
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
  ...buildGeolocationParameter({ aroundRadius, geolocation, locationType }),
})

export const fetchMultipleAlgolia = (
  parsedParametersList: SearchParameters[]
): Readonly<Promise<MultipleQueriesResponse<AlgoliaHit>>> => {
  const queries = parsedParametersList.map((parsedParameters) => ({
    indexName: env.ALGOLIA_INDEX_NAME,
    query: '',
    params: {
      ...buildHitsPerPage(parsedParameters.hitsPerPage),
      ...buildSearchParameters(parsedParameters),
      attributesToHighlight: [], // We disable highlighting because we don't need it
      attributesToRetrieve,
    },
  }))

  return client.multipleQueries(queries)
}

export const fetchAlgolia = ({
  query = '',
  page = 0,
  ...parameters
}: SearchParametersQuery): Readonly<Promise<Response>> => {
  const searchParameters = buildSearchParameters(parameters)
  const index = client.initIndex(env.ALGOLIA_INDEX_NAME)

  return index.search(query, {
    page,
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

const buildHitsPerPage = (hitsPerPage: SearchParameters['hitsPerPage']) =>
  hitsPerPage ? { hitsPerPage } : null

const buildGeolocationParameter = ({
  aroundRadius,
  geolocation,
  locationType,
}: Pick<SearchParameters, 'aroundRadius' | 'geolocation' | 'locationType'>):
  | { aroundLatLng: string; aroundRadius: 'all' | number }
  | undefined => {
  if (!geolocation) return

  return {
    aroundLatLng: `${geolocation.latitude}, ${geolocation.longitude}`,
    aroundRadius: computeAroudRadiusInMeters(aroundRadius, locationType),
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
