import { Response } from 'features/search/pages/useSearchResults'
import { SearchParametersQuery } from 'libs/algolia'
import { useTransformAlgoliaHits } from 'libs/algolia/fetchAlgolia'
import { client } from 'libs/search/client'
import { AppSearchFields, buildQueryOptions } from 'libs/search/filters'
import { buildAlgoliaHit } from 'libs/search/utils/buildAlgoliaHit'

const fetchHits = (params: SearchParametersQuery): Promise<Response> => {
  const options = buildQueryOptions(params, params.page)

  return client.search<AppSearchFields>(params.query, options).then((response) => {
    const { meta } = response.info

    return {
      hits: response.results.map(buildAlgoliaHit),
      nbHits: meta.page.total_results,
      page: meta.page.current,
      nbPages: meta.page.total_pages,
    }
  })
}

export const useSearchQuery = () => {
  const transformAlgoliaHit = useTransformAlgoliaHits()

  return {
    fetchHits,
    transformHits: transformAlgoliaHit,
  }
}
