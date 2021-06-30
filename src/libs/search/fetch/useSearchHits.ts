import { SearchOptions } from '@elastic/app-search-javascript'

import { useTransformAlgoliaHits } from 'libs/algolia/fetchAlgolia'
import { SearchHit } from 'libs/search'
import { client } from 'libs/search/client'
import { AppSearchFields, RESULT_FIELDS } from 'libs/search/filters'
import { buildAlgoliaHit } from 'libs/search/utils/buildAlgoliaHit'

const fetchHits = (ids: string[]): Promise<{ results: { hits: SearchHit[] } }> => {
  const options: SearchOptions<AppSearchFields> = {
    result_fields: RESULT_FIELDS,
    filters: { any: ids.map((id) => ({ [AppSearchFields.object_id]: id })) },
  }

  return client.search<AppSearchFields>('', options).then((response) => ({
    results: response.results.map(buildAlgoliaHit),
  }))
}

// We don't want to display offers without image
const filterHits = (hit: SearchHit): boolean => hit && hit.offer && !!hit.offer.thumbUrl

export const useSearchHits = () => {
  const transformHits = useTransformAlgoliaHits()

  return {
    fetchHits,
    filterHits,
    transformHits,
  }
}
