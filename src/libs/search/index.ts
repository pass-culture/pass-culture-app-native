import { VenueTypeCode } from 'api/gen'
import { AlgoliaHit } from 'libs/algolia'
import { Geoloc as AlgoliaGeoloc } from 'libs/algolia/algolia.d'
import { transformAlgoliaHit } from 'libs/algolia/fetchAlgolia'
export { parseSearchParameters } from './parseSearchParameters'
export { useParseSearchParameters } from './useParseSearchParameters'

export const transformHit = transformAlgoliaHit
export type SearchHit = AlgoliaHit

export type Geoloc = AlgoliaGeoloc

export interface VenueHit {
  id: string
  name: string
  offererName: string
  venueType: VenueTypeCode
  position: Geoloc
  description: string
  audioDisability: boolean
  mentalDisability: boolean
  motorDisability: boolean
  visualDisability: boolean
  email: string
  phoneNumber: string
  website: string
  facebook: string
  twitter: string
  instagram: string
  snapchat: string
}
