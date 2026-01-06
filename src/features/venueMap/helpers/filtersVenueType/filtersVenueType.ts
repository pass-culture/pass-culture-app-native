import { Activity } from 'api/gen'
import { FILTERS_ACTIVITY_MAPPING } from 'features/venueMap/constant'

/**
 * Returns the filters associated with a macro-section.
 */
export const getFiltersByMacro = (macro: keyof typeof FILTERS_ACTIVITY_MAPPING): Activity[] => {
  return FILTERS_ACTIVITY_MAPPING[macro]
}

/**
 * Determines which macros are enabled based on active filters.
 */
export const getActiveMacroFilters = (activeFilters: Activity[]) => {
  return Object.entries(FILTERS_ACTIVITY_MAPPING)
    .filter(([_, filters]) => filters.some((filter) => activeFilters.includes(filter)))
    .map(([macro]) => macro)
}
