import { fetchAlgolia, useTransformAlgoliaHits } from 'libs/algolia/fetchAlgolia'

export const useAlgoliaQuery = () => {
  const transformAlgoliaHit = useTransformAlgoliaHits()

  return {
    fetchHits: fetchAlgolia,
    transformHits: transformAlgoliaHit,
  }
}
