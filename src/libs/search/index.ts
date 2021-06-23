import { AlgoliaHit } from 'libs/algolia'
import { Geoloc as AlgoliaGeoloc } from 'libs/algolia/algolia.d'
import { transformAlgoliaHit } from 'libs/algolia/fetchAlgolia'
export { parseSearchParameters } from './parseSearchParameters'

export const transformHit = transformAlgoliaHit
export type SearchHit = AlgoliaHit

export type Geoloc = AlgoliaGeoloc

export { useFetchMultipleHits, useFetchHits, useFetchQuery } from './fetch'
