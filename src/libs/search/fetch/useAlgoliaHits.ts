import {
  fetchAlgoliaHits,
  filterAlgoliaHit,
  useTransformAlgoliaHits,
} from 'libs/algolia/fetchAlgolia'

export const useAlgoliaHits = () => {
  const transformAlgoliaHit = useTransformAlgoliaHits()

  return {
    fetchHits: fetchAlgoliaHits,
    filterHits: filterAlgoliaHit,
    transformHits: transformAlgoliaHit,
  }
}
