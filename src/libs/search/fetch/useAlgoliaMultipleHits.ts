import {
  fetchMultipleAlgolia,
  filterAlgoliaHit,
  useTransformAlgoliaHits,
} from 'libs/algolia/fetchAlgolia'

export const useAlgoliaMultipleHits = () => {
  const transformAlgoliaHit = useTransformAlgoliaHits()

  return {
    fetchMultipleHits: fetchMultipleAlgolia,
    filterHits: filterAlgoliaHit,
    transformHits: transformAlgoliaHit,
  }
}
