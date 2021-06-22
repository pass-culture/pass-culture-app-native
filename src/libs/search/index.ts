import { AlgoliaHit, parseAlgoliaParameters } from 'libs/algolia'
import { Geoloc } from 'libs/algolia/algolia.d'
import { CATEGORY_CRITERIA } from 'libs/algolia/enums'
import {
  attributesToRetrieve,
  fetchAlgolia,
  fetchAlgoliaHits,
  fetchMultipleAlgolia,
  filterSearchHit,
  transformAlgoliaHit,
  useTransformAlgoliaHits,
} from 'libs/algolia/fetchAlgolia'
import { AlgoliaGeolocation } from 'libs/algolia/types'

export const fetchHits = fetchAlgoliaHits
export const fetchMultipleHits = fetchMultipleAlgolia
export const transformHit = transformAlgoliaHit
export const useTransformHits = useTransformAlgoliaHits
export type SearchHit = AlgoliaHit

export type { Geoloc, AlgoliaGeolocation }
export {
  CATEGORY_CRITERIA,
  attributesToRetrieve,
  parseAlgoliaParameters,
  fetchAlgolia,
  filterSearchHit,
}
