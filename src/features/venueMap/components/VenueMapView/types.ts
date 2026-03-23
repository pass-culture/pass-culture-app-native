import { Venue } from 'features/venue/types'

export type GeolocatedVenue = Omit<Venue, 'venueId'> & {
  _geoloc: { lat: number; lng: number }
  venueId: number
  isPermanent: boolean
}

export type ClusterImageColorName =
  | 'pink'
  | 'orange'
  | 'blue'
  | 'blue_orange'
  | 'blue_orange_pink'
  | 'blue_pink'
  | 'orange_pink'
