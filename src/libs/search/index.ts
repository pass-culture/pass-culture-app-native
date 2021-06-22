import { AlgoliaHit, ParsedAlgoliaParameters, parseAlgoliaParameters } from 'libs/algolia'
import { Geoloc } from 'libs/algolia/algolia.d'
import { CATEGORY_CRITERIA, DATE_FILTER_OPTIONS } from 'libs/algolia/enums'
import {
  attributesToRetrieve,
  fetchAlgolia,
  fetchAlgoliaHits,
  fetchMultipleAlgolia,
  filterSearchHit,
  transformAlgoliaHit,
  useTransformAlgoliaHits,
} from 'libs/algolia/fetchAlgolia'
import { FetchAlgoliaParameters, AlgoliaGeolocation, LocationType } from 'libs/algolia/types'

export const fetchHits = fetchAlgoliaHits
export const fetchMultipleHits = fetchMultipleAlgolia
export const transformHit = transformAlgoliaHit
export const useTransformHits = useTransformAlgoliaHits
export type SearchHit = AlgoliaHit

export type { ParsedAlgoliaParameters, Geoloc, AlgoliaGeolocation, FetchAlgoliaParameters }
export {
  CATEGORY_CRITERIA,
  LocationType,
  DATE_FILTER_OPTIONS,
  attributesToRetrieve,
  parseAlgoliaParameters,
  fetchAlgolia,
  filterSearchHit,
}
