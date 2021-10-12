import { SubcategoryIdEnum, VenueResponse } from 'api/gen'
import { AlgoliaHit } from 'libs/algolia'
import { Geoloc as AlgoliaGeoloc } from 'libs/algolia/algolia.d'
import { transformAlgoliaHit } from 'libs/algolia/fetchAlgolia'
export { parseSearchParameters } from './parseSearchParameters'
export { useParseSearchParameters } from './useParseSearchParameters'

export const transformHit = transformAlgoliaHit
export type IncompleteSearchHit = AlgoliaHit
export interface SearchHit {
  offer: {
    dates?: AlgoliaHit['offer']['dates']
    isDigital?: AlgoliaHit['offer']['isDigital']
    isDuo?: AlgoliaHit['offer']['isDuo']
    name?: AlgoliaHit['offer']['name']
    prices?: AlgoliaHit['offer']['prices']
    subcategoryId: SubcategoryIdEnum
    thumbUrl?: AlgoliaHit['offer']['thumbUrl']
  }
  _geoloc: AlgoliaHit['_geoloc']
  objectID: AlgoliaHit['objectID']
}

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
