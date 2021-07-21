import { useTransformAlgoliaHits } from 'libs/algolia/fetchAlgolia'
import { SearchHit } from 'libs/search'

import { fetchMultipleHits } from './search'

// We don't want to display offers without image
const filterHits = (hit: SearchHit): boolean => hit && hit.offer && !!hit.offer.thumbUrl

export const useSearchMultipleHits = () => {
  const transformHits = useTransformAlgoliaHits()

  return {
    fetchMultipleHits,
    filterHits,
    transformHits,
  }
}
