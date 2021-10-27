import { SearchOptions } from '@elastic/app-search-javascript'
import { flatten } from 'lodash'

import { VenuesSearchParametersFields } from 'features/home/contentful'
import { Response } from 'features/search/pages/useSearchResults'
import { PartialSearchState } from 'features/search/types'
import { SearchParametersQuery } from 'libs/algolia'
import { GeoCoordinates } from 'libs/geolocation'
import { IncompleteSearchHit, SearchHit, VenueHit } from 'libs/search'
import { offersClient, venuesClient } from 'libs/search/client'
import {
  buildQueryOptions,
  AppSearchFields,
  RESULT_FIELDS,
  underageFilter,
  buildVenuesQueryOptions,
} from 'libs/search/filters'
import { FALSE, VENUES_RESULT_FIELDS } from 'libs/search/filters/constants'
import { AppSearchVenuesFields } from 'libs/search/filters/constants'
import { buildAlgoliaHit, buildVenues } from 'libs/search/utils/buildAlgoliaHit'
import { buildVenueHits } from 'libs/search/utils/buildVenueHits'
import { SuggestedVenue } from 'libs/venue'

interface SearchResponse {
  hits: SearchHit[]
  nbHits: number
}

// We don't want to display offers without subcategoryId
export const filterHasSubcategoryId = (hit: IncompleteSearchHit): boolean =>
  hit && hit.offer && typeof hit.offer.subcategoryId !== 'undefined'

// We don't want to display offers without image nor subcategoryId
export const filterSearchHits = (hit: IncompleteSearchHit): boolean =>
  filterHasSubcategoryId(hit) && !!hit.offer.thumbUrl

export const fetchObjects = async (
  ids: string[],
  isUserUnderage: boolean
): Promise<{ results: SearchHit[] }> => {
  const options: SearchOptions<AppSearchFields> = {
    result_fields: RESULT_FIELDS,
    filters: {
      any: ids.map((id) => ({ [AppSearchFields.id]: id })),
      ...(isUserUnderage && underageFilter),
      all: [{ [AppSearchFields.is_educational]: FALSE }],
    },
  }

  const response = await offersClient.search<AppSearchFields>('', options)
  return {
    results: response.results.map(buildAlgoliaHit).filter(filterHasSubcategoryId) as SearchHit[],
  }
}

export const fetchMultipleHits = async (
  paramsList: PartialSearchState[],
  userLocation: GeoCoordinates | null,
  isUserUnderage: boolean
): Promise<SearchResponse> => {
  const queries = paramsList.map((params) => ({
    query: params.query,
    options: buildQueryOptions(params, userLocation, isUserUnderage),
  }))

  const allResults = await offersClient.multiSearch<AppSearchFields>(queries)
  const hits = allResults
    .flatMap(({ results }) => results.map(buildAlgoliaHit))
    .filter(filterHasSubcategoryId) as SearchHit[]

  // We only use the total hits from the first search parameters, as this will
  // be used for the 'See More' button to redirect to search
  const nbHits = allResults[0] ? allResults[0].info.meta.page.total_results : 0
  return { hits: flatten(hits), nbHits }
}

export const fetchHits = async (
  params: SearchParametersQuery,
  userLocation: GeoCoordinates | null,
  isUserUnderage: boolean
): Promise<Response> => {
  const options = buildQueryOptions(params, userLocation, isUserUnderage, params.page)

  const response = await offersClient.search<AppSearchFields>(params.query, options)
  const { meta } = response.info

  return {
    hits: response.results.map(buildAlgoliaHit).filter(filterHasSubcategoryId) as SearchHit[],
    nbHits: meta.page.total_results,
    page: meta.page.current,
    nbPages: meta.page.total_pages,
  }
}

export const fetchVenues = async (query: string): Promise<SuggestedVenue[]> => {
  const options: SearchOptions<AppSearchVenuesFields> = {
    result_fields: VENUES_RESULT_FIELDS,
    group: { field: AppSearchVenuesFields.id },
  }

  const response = await venuesClient.search<AppSearchVenuesFields>(query, options)
  return response.results.map(buildVenues)
}

// Used for the venue playlists on the homepage
export const fetchMultipleVenues = async (
  paramsList: VenuesSearchParametersFields[],
  userLocation: GeoCoordinates | null
): Promise<VenueHit[]> => {
  const queries = paramsList.map((params) => ({
    query: '',
    options: buildVenuesQueryOptions(params, userLocation),
  }))

  const allResults = await venuesClient.multiSearch<AppSearchVenuesFields>(queries)
  return flatten(allResults.flatMap(({ results }) => results.map(buildVenueHits) as VenueHit[]))
}
