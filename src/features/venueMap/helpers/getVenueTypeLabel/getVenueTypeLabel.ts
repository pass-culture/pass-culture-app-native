import { parseType, VenueTypeCode } from 'libs/parsers/venueType'

export const getVenueTypeLabel = (venueTypeCode?: VenueTypeCode | null): string | null =>
  venueTypeCode ? parseType(venueTypeCode) : null
