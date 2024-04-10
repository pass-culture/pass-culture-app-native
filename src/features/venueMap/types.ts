import { VenueTypeCode } from 'libs/parsers/venueType'

type VenueTypeChildMapping = {
  [key in VenueTypeCode]: string
}

export type VenueTypeMapping = {
  title: string
  children: Partial<VenueTypeChildMapping>
}

export type VenuesCountByType = {
  [key in VenueTypeCode]: number
}
