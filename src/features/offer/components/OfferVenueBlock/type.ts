import { Coordinates } from 'api/gen'

export type VenueBlockVenue = {
  address?: string | null
  addressId?: number
  city?: string | null
  coordinates?: Coordinates
  id: number
  name: string
  postalCode?: string | null
  publicName?: string | null
  bannerUrl?: string | null
}

export type VenueBlockAddress = {
  id?: number
  city: string
  label?: string | null
  postalCode: string
  street?: string | null
}
