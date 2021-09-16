import { SearchOptions } from '@elastic/app-search-javascript'
import { flatten } from 'lodash'

import { OptionalCategoryCriteria } from 'features/search/enums'
import { Response } from 'features/search/pages/useSearchResults'
import { SearchState } from 'features/search/types'
import { SearchParametersQuery } from 'libs/algolia'
import { GeoCoordinates } from 'libs/geolocation'
import { SearchHit, VenueHit } from 'libs/search'
import { offersClient, venuesClient } from 'libs/search/client'
import {
  buildQueryOptions,
  AppSearchFields,
  RESULT_FIELDS,
  underageFilter,
} from 'libs/search/filters'
import { FALSE } from 'libs/search/filters/constants'
import { AppSearchVenuesFields } from 'libs/search/filters/constants'
import { buildAlgoliaHit, buildVenues } from 'libs/search/utils/buildAlgoliaHit'
import { buildVenueHits } from 'libs/search/utils/buildVenueHits'
import { SuggestedVenue } from 'libs/venue'

interface SearchResponse {
  hits: SearchHit[]
  nbHits: number
}

export const fetchObjects = async (
  ids: string[],
  availableCategories: OptionalCategoryCriteria,
  isUserUnderage: boolean
): Promise<{ results: SearchHit[] }> => {
  const options: SearchOptions<AppSearchFields> = {
    result_fields: RESULT_FIELDS,
    filters: {
      any: ids.map((id) => ({ [AppSearchFields.id]: id })),
      ...(isUserUnderage && underageFilter),
      all: [
        { [AppSearchFields.category]: Object.keys(availableCategories) },
        { [AppSearchFields.is_educational]: FALSE },
      ],
    },
  }

  const response = await offersClient.search<AppSearchFields>('', options)
  return { results: response.results.map(buildAlgoliaHit) }
}

export const fetchMultipleHits = async (
  paramsList: SearchState[],
  userLocation: GeoCoordinates | null,
  isUserUnderage: boolean
): Promise<SearchResponse> => {
  const queries = paramsList.map((params) => ({
    query: params.query,
    options: buildQueryOptions(params, userLocation, isUserUnderage),
  }))

  const allResults = await offersClient.multiSearch<AppSearchFields>(queries)
  const hits = allResults.flatMap(({ results }) => results.map(buildAlgoliaHit))

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
    hits: response.results.map(buildAlgoliaHit),
    nbHits: meta.page.total_results,
    page: meta.page.current,
    nbPages: meta.page.total_pages,
  }
}

export const fetchVenueOffers = async (
  params: SearchState,
  isUserUnderage: boolean
): Promise<SearchResponse> => {
  const options = buildQueryOptions(params, null, isUserUnderage) // no need of geolocation to get venues, yet?

  const response = await offersClient.search<AppSearchFields>('', options)
  const { meta } = response.info

  return {
    hits: response.results.map(buildAlgoliaHit),
    nbHits: meta.page.total_results,
  }
}

export const fetchVenues = async (query: string): Promise<SuggestedVenue[]> => {
  const options: SearchOptions<AppSearchFields> = {
    result_fields: {
      [AppSearchFields.offerer_name]: { raw: {} },
      [AppSearchFields.venue_id]: { raw: {} },
      [AppSearchFields.venue_name]: { raw: {} },
    },
    search_fields: {
      [AppSearchFields.offerer_name]: { weight: 1 },
      [AppSearchFields.venue_name]: { weight: 1 },
      [AppSearchFields.venue_public_name]: { weight: 1 },
    },
    group: { field: AppSearchFields.venue_id },
  }

  // TODO(antoinewg): once venues are indexed on AppSearch, use this index.
  const response = await offersClient.search<AppSearchFields>(query, options)
  return response.results.map(buildVenues)
}

// Used for the venue playlists on the homepage
export const fetchMultipleVenues = async (): Promise<VenueHit[]> => {
  const options: SearchOptions<AppSearchVenuesFields> = {
    result_fields: {
      [AppSearchVenuesFields.id]: { raw: {} },
      [AppSearchVenuesFields.name]: { raw: {} },
    },
  }

  const response = await venuesClient.search<AppSearchVenuesFields>('', options)
  return response.results.map(buildVenueHits) as VenueHit[]
}
