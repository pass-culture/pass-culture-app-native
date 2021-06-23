import { fetchAlgolia, filterAlgoliaHit, useTransformAlgoliaHits } from 'libs/algolia/fetchAlgolia'

export const useAlgoliaQuery = () => {
  const transformAlgoliaHit = useTransformAlgoliaHits()

  return {
    fetchHits: fetchAlgolia,
    filterHits: filterAlgoliaHit,
    transformHits: transformAlgoliaHit,
  }
}
