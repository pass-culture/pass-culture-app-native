import {
  fetchAlgoliaHits,
  filterAlgoliaHit,
  useTransformAlgoliaHits,
} from 'libs/algolia/fetchAlgolia'

export const useSearchHits = () => {
  // TODO(antoinewg) use functions to connect to app search
  const transformAlgoliaHit = useTransformAlgoliaHits()

  return {
    fetchHits: fetchAlgoliaHits,
    filterHits: filterAlgoliaHit,
    transformHits: transformAlgoliaHit,
  }
}
