import { VenueTypeCodeKey } from 'api/gen'
import { FILTERS_VENUE_TYPE_MAPPING } from 'features/venueMap/constant'

/**
 * Returns the filters associated with a macro-section.
 */
export const getFiltersByMacro = (
  macro: keyof typeof FILTERS_VENUE_TYPE_MAPPING
): VenueTypeCodeKey[] => {
  return FILTERS_VENUE_TYPE_MAPPING[macro]
}

/**
 * Determines which macros are enabled based on active filters.
 */
export const getActiveMacroFilters = (activeFilters: VenueTypeCodeKey[]) => {
  return Object.entries(FILTERS_VENUE_TYPE_MAPPING)
    .filter(([_, filters]) => filters.some((filter) => activeFilters.includes(filter)))
    .map(([macro]) => macro)
}
