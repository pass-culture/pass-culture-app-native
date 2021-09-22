import { VENUE_TYPE_CRITERIA } from 'features/search/enums'

export const getVenueTypeFacetFilters = (venueTypeLabel: string): string => {
  const venueType = Object.values(VENUE_TYPE_CRITERIA).find(({ label }) => label === venueTypeLabel)
  return venueType ? venueType.facetFilter : ''
}
