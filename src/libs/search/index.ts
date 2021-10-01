import { VenueResponse } from 'api/gen'
import { AlgoliaHit } from 'libs/algolia'
import { Geoloc as AlgoliaGeoloc } from 'libs/algolia/algolia.d'
import { transformAlgoliaHit } from 'libs/algolia/fetchAlgolia'
export { parseSearchParameters } from './parseSearchParameters'
export { useParseSearchParameters } from './useParseSearchParameters'

export const transformHit = transformAlgoliaHit
export type SearchHit = AlgoliaHit

export type Geoloc = AlgoliaGeoloc

export type VenueHit = Pick<
  VenueResponse,
  | 'accessibility'
  | 'contact'
  | 'description'
  | 'id'
  | 'latitude'
  | 'longitude'
  | 'name'
  | 'publicName'
  | 'venueTypeCode'
>
