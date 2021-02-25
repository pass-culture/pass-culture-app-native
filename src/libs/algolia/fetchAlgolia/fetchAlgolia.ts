import { GetObjectsResponse, SearchResponse } from '@algolia/client-search'
import algoliasearch from 'algoliasearch'

import { SearchParameters } from 'features/search/pages/reducer'
import { RADIUS_FILTERS } from 'libs/algolia/enums'
import { buildFacetFilters } from 'libs/algolia/fetchAlgolia/fetchAlgolia.facetFilters'
import { buildNumericFilters } from 'libs/algolia/fetchAlgolia/fetchAlgolia.numericFilters'
import { FetchAlgoliaParameters, LocationType } from 'libs/algolia/types'
import { env } from 'libs/environment'

const client = algoliasearch(env.ALGOLIA_APPLICATION_ID, env.ALGOLIA_SEARCH_API_KEY)

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

export const fetchAlgolia = <T>({
  query = '',
  page = 0,
  hitsPerPage = null,
  attributesToRetrieve,
  ...parameters
}: FetchAlgoliaParameters & { attributesToRetrieve?: string[] }): Readonly<
  Promise<SearchResponse<T>>
> => {
  const searchParameters = buildSearchParameters(parameters)
  const index = client.initIndex(env.ALGOLIA_INDEX_NAME)

  return index.search<T>(query, {
    page,
    ...buildHitsPerPage(hitsPerPage),
    ...searchParameters,
    attributesToRetrieve: attributesToRetrieve ?? ['*'],
    attributesToHighlight: [], // We disable highlighting for performance reasons
  })
}

export const fetchAlgoliaHits = <T>(
  objectIds: string[]
): Readonly<Promise<GetObjectsResponse<T>>> => {
  const index = client.initIndex(env.ALGOLIA_INDEX_NAME)
  return index.getObjects<T>(objectIds)
}

const buildHitsPerPage = (hitsPerPage: FetchAlgoliaParameters['hitsPerPage']) =>
  hitsPerPage ? { hitsPerPage } : null

const buildGeolocationParameter = ({
  aroundRadius,
  geolocation,
  locationType,
}: Pick<FetchAlgoliaParameters, 'aroundRadius' | 'geolocation' | 'locationType'>):
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
