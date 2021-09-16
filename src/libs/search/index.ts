import { AlgoliaHit } from 'libs/algolia'
import { Geoloc as AlgoliaGeoloc } from 'libs/algolia/algolia.d'
import { transformAlgoliaHit } from 'libs/algolia/fetchAlgolia'
import { GeoCoordinates } from 'libs/geolocation'
export { parseSearchParameters } from './parseSearchParameters'
export { useParseSearchParameters } from './useParseSearchParameters'

export const transformHit = transformAlgoliaHit
export type SearchHit = AlgoliaHit

export type Geoloc = AlgoliaGeoloc

export interface VenueHit {
  id: string
  name: string
  offererName: string
  venueType: string
  position: GeoCoordinates
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
