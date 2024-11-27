import { VenueTypeCode } from 'libs/parsers/venueType'

type VenueTypeChildMapping = {
  [key in VenueTypeCode]: string
}

export type Size = { width: number; height: number }

export type VenueTypeMapping = {
  title: string
  children: Partial<VenueTypeChildMapping>
}

export type VenuesCountByType = {
  [key in VenueTypeCode]: number
}

export type FilterGroupData = {
  id: FilterGroupKey
  label: string
  color: string
}

export type FilterGroupKey = keyof typeof FILTERS_VENUE_TYPE_MAPPING
