import { useTransformAlgoliaHits } from 'libs/algolia/fetchAlgolia'
import { SearchHit } from 'libs/search'

import { fetchObjects } from './search'

// We don't want to display offers without image
const filterHits = (hit: SearchHit): boolean => hit && hit.offer && !!hit.offer.thumbUrl

export const useSearchHits = () => {
  const transformHits = useTransformAlgoliaHits()

  return {
    fetchHits: fetchObjects,
    filterHits,
    transformHits,
  }
}
