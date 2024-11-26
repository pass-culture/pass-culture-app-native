import { VenueTypeCodeKey } from 'api/gen'
import { FILTERS_VENUE_TYPE_MAPPING } from 'features/venueMap/constant'
import {
  getActiveMacroFilters,
  getFiltersByMacro,
} from 'features/venueMap/helpers/filtersVenueType/filtersVenueType'
import { useVenuesFilter, useVenuesFilterActions } from 'features/venueMap/store/venuesFilterStore'

export const useVenueMapFilters = () => {
  const activeFilters = useVenuesFilter()
  const { setVenuesFilters, addVenuesFilters, removeVenuesFilters } = useVenuesFilterActions()

  const addMacroFilter = (macro: keyof typeof FILTERS_VENUE_TYPE_MAPPING) => {
    const filters = getFiltersByMacro(macro)
    setVenuesFilters([...activeFilters, ...filters])
  }

  const removeMacroFilter = (macro: keyof typeof FILTERS_VENUE_TYPE_MAPPING) => {
    const filters = getFiltersByMacro(macro)
    setVenuesFilters(activeFilters.filter((filter) => !filters.includes(filter)))
  }

  const toggleFilter = (filter: VenueTypeCodeKey) => {
    if (activeFilters.includes(filter)) {
      removeVenuesFilters([filter])
    } else {
      addVenuesFilters([filter])
    }
  }

  const getSelectedMacroFilters = () => getActiveMacroFilters(activeFilters)

  return {
    activeFilters,
    addMacroFilter,
    removeMacroFilter,
    toggleFilter,
    getSelectedMacroFilters,
  }
}
