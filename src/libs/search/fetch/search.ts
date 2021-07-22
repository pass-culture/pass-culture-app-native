import { SearchOptions } from '@elastic/app-search-javascript'
import { flatten } from 'lodash'

import { Response } from 'features/search/pages/useSearchResults'
import { SearchParameters } from 'features/search/types'
import { SearchParametersQuery } from 'libs/algolia'
import { SearchHit } from 'libs/search'
import { client } from 'libs/search/client'
import { buildQueryOptions, AppSearchFields, RESULT_FIELDS } from 'libs/search/filters'
import { buildAlgoliaHit } from 'libs/search/utils/buildAlgoliaHit'

export const fetchObjects = async (ids: string[]): Promise<{ results: SearchHit[] }> => {
  const options: SearchOptions<AppSearchFields> = {
    result_fields: RESULT_FIELDS,
    filters: { any: ids.map((id) => ({ [AppSearchFields.id]: id })) },
  }

  const response = await client.search<AppSearchFields>('', options)
  return { results: response.results.map(buildAlgoliaHit) }
}

export const fetchMultipleHits = async (
  parametersList: SearchParameters[]
): Promise<{ hits: SearchHit[]; nbHits: number }> => {
  const queries = parametersList.map((params) => ({
    query: '',
    options: buildQueryOptions(params),
  }))

  const allResults = await client.multiSearch<AppSearchFields>(queries)
  const hits = allResults.flatMap(({ results }) => results.map(buildAlgoliaHit))

  // We only use the total hits from the first search parameters, as this will
  // be used for the 'See More' button to redirect to search
  const nbHits = allResults[0].info.meta.page.total_results
  return { hits: flatten(hits), nbHits }
}

export const fetchHits = async (params: SearchParametersQuery): Promise<Response> => {
  const options = buildQueryOptions(params, params.page)

  const response = await client.search<AppSearchFields>(params.query, options)
  const { meta } = response.info

  return {
    hits: response.results.map(buildAlgoliaHit),
    nbHits: meta.page.total_results,
    page: meta.page.current,
    nbPages: meta.page.total_pages,
  }
}
