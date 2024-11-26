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

  const toggleMacroFilter = (macro: keyof typeof FILTERS_VENUE_TYPE_MAPPING) => {
    const filters = getFiltersByMacro(macro)
    const isMacroActive = filters?.every((filter) => activeFilters.includes(filter))

    if (isMacroActive) {
      removeVenuesFilters(filters)
    } else {
      addVenuesFilters(filters)
    }
  }

  const getSelectedMacroFilters = () => getActiveMacroFilters(activeFilters)

  return {
    activeFilters,
    addMacroFilter,
    removeMacroFilter,
    toggleMacroFilter,
    getSelectedMacroFilters,
  }
}
