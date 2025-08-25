import { VenueTypeCodeKey } from 'api/gen'
import { FILTERS_VENUE_TYPE_MAPPING } from 'features/venueMap/constant'
import { MAP_VENUE_TYPE_TO_LABEL } from 'libs/parsers/venueType'

export function getFilterDescription(
  filterGroup: 'OUTINGS' | 'SHOPS' | 'OTHERS',
  venueFilters: VenueTypeCodeKey[]
) {
  const venueTypesGroup: VenueTypeCodeKey[] = FILTERS_VENUE_TYPE_MAPPING[filterGroup].filter(
    (item): item is VenueTypeCodeKey => item in MAP_VENUE_TYPE_TO_LABEL
  )

  const selectedVenueTypesGroup = venueTypesGroup.filter((type) => venueFilters.includes(type))

  return selectedVenueTypesGroup.length === venueTypesGroup.length
    ? 'Tout'
    : selectedVenueTypesGroup.map((type) => MAP_VENUE_TYPE_TO_LABEL[type]).join(', ')
}
