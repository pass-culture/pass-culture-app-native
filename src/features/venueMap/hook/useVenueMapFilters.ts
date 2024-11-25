import { VenueTypeCodeKey } from 'api/gen'
import { FILTERS_VENUE_TYPE_MAPPING } from 'features/venueMap/constant'
import {
  getActiveMacros,
  getFiltersByMacro,
} from 'features/venueMap/helpers/filtersVenueType/filtersVenueType'
import { useVenuesFilter, useVenuesFilterActions } from 'features/venueMap/store/venuesFilterStore'

export const useVenueMapFilters = () => {
  const activeFilters = useVenuesFilter()
  const { setVenuesFilters, addVenuesFilters, removeVenuesFilters } = useVenuesFilterActions()

  const applyMacroFilters = (macro: keyof typeof FILTERS_VENUE_TYPE_MAPPING) => {
    const filters = getFiltersByMacro(macro)
    setVenuesFilters(filters)
  }

  const toggleFilter = (filter: VenueTypeCodeKey) => {
    if (activeFilters.includes(filter)) {
      removeVenuesFilters([filter])
    } else {
      addVenuesFilters([filter])
    }
  }

  const getSelectedMacros = () => getActiveMacros(activeFilters)

  return {
    activeFilters,
    applyMacroFilters,
    toggleFilter,
    getSelectedMacros,
  }
}
