import { fetchAlgolia, filterAlgoliaHit, useTransformAlgoliaHits } from 'libs/algolia/fetchAlgolia'

export const useSearchQuery = () => {
  // TODO(antoinewg) use functions to connect to app search
  const transformAlgoliaHit = useTransformAlgoliaHits()

  return {
    fetchHits: fetchAlgolia,
    filterHits: filterAlgoliaHit,
    transformHits: transformAlgoliaHit,
  }
}
