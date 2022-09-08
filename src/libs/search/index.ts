import { SubcategoryIdEnum, VenueResponse } from 'api/gen'
import { AlgoliaHit } from 'libs/algolia'
import { Geoloc as AlgoliaGeoloc } from 'libs/algolia/algolia.d'
import { transformOfferHit } from 'libs/algolia/fetchAlgolia'
import { VenueTypeCode } from 'libs/parsers'
export { parseSearchParameters } from './parseSearchParameters'
export { useParseSearchParameters } from './useParseSearchParameters'

export const transformHit = transformOfferHit

// An incomplete search hit may not have a subcategoryId (for retrocompatibility)
export type IncompleteSearchHit = AlgoliaHit

export interface SearchHit {
  offer: {
    dates?: AlgoliaHit['offer']['dates']
    isDigital?: AlgoliaHit['offer']['isDigital']
    isDuo?: AlgoliaHit['offer']['isDuo']
    isEducational?: AlgoliaHit['offer']['isEducational']
    name?: AlgoliaHit['offer']['name']
    prices?: AlgoliaHit['offer']['prices']
    subcategoryId: SubcategoryIdEnum
    thumbUrl?: AlgoliaHit['offer']['thumbUrl']
  }
  objectID: AlgoliaHit['objectID']
  _geoloc: AlgoliaHit['_geoloc']
}

export type Geoloc = AlgoliaGeoloc

export type VenueHit = Pick<
  VenueResponse,
  | 'accessibility'
  | 'bannerUrl'
  | 'contact'
  | 'description'
  | 'id'
  | 'latitude'
  | 'longitude'
  | 'name'
  | 'publicName'
> & {
  venueTypeCode: VenueTypeCode
}
