import { Venue } from 'features/venue/types'

export type GeolocatedVenue = Omit<Venue, 'venueId'> & {
  _geoloc: { lat: number; lng: number }
  venueId: number
  isPermanent?: boolean
}
