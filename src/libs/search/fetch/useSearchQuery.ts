import { useTransformAlgoliaHits } from 'libs/algolia/fetchAlgolia'

import { fetchHits } from './search'

export const useSearchQuery = () => {
  const transformAlgoliaHit = useTransformAlgoliaHits()

  return {
    fetchHits,
    transformHits: transformAlgoliaHit,
  }
}
