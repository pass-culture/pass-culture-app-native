import { Geoloc } from 'libs/algolia'

export interface Venue {
  label: string
  info: string
  venueId: number | null
  _geoloc?: Geoloc
}
