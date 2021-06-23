import {
  fetchMultipleAlgolia,
  filterAlgoliaHit,
  useTransformAlgoliaHits,
} from 'libs/algolia/fetchAlgolia'

export const useSearchMultipleHits = () => {
  // TODO(antoinewg) use functions to connect to app search
  const transformAlgoliaHit = useTransformAlgoliaHits()

  return {
    fetchMultipleHits: fetchMultipleAlgolia,
    filterHits: filterAlgoliaHit,
    transformHits: transformAlgoliaHit,
  }
}
