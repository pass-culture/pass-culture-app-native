import { useTransformAlgoliaHits } from 'libs/algolia/fetchAlgolia'

import { fetchMultipleHits, filterSearchHits } from './search'

export const useSearchMultipleHits = () => {
  const transformHits = useTransformAlgoliaHits()

  return {
    fetchMultipleHits,
    filterHits: filterSearchHits,
    transformHits,
  }
}
