import { useTransformAlgoliaHits } from 'libs/algolia/fetchAlgolia'

import { fetchObjects, filterSearchHits } from './search'

export const useSearchHits = () => {
  const transformHits = useTransformAlgoliaHits()

  return {
    fetchHits: fetchObjects,
    filterHits: filterSearchHits,
    transformHits,
  }
}
