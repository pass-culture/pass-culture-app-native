import { parseType, VenueTypeCode } from 'libs/parsers/venueType'

export const getVenueTypeLabel = (venueTypeCode: VenueTypeCode | null) =>
  venueTypeCode ? parseType(venueTypeCode) : 'Type de lieu'
