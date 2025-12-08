import { FILTERS_ACTIVITY_MAPPING } from 'features/venueMap/constant'
import {
  getActiveMacroFilters,
  getFiltersByMacro,
} from 'features/venueMap/helpers/filtersVenueType/filtersVenueType'
import { useVenuesFilter, venuesFilterActions } from 'features/venueMap/store/venuesFilterStore'

export const useVenueMapFilters = () => {
  const activeFilters = useVenuesFilter()
  const { setVenuesFilters, addVenuesFilters, removeVenuesFilters } = venuesFilterActions

  const addMacroFilter = (macro: keyof typeof FILTERS_ACTIVITY_MAPPING) => {
    const filters = getFiltersByMacro(macro)
    setVenuesFilters([...activeFilters, ...filters])
  }

  const removeMacroFilter = (macro: keyof typeof FILTERS_ACTIVITY_MAPPING) => {
    const filters = getFiltersByMacro(macro)
    setVenuesFilters(activeFilters.filter((filter) => !filters.includes(filter)))
  }

  /**
   *
   * @param macro
   * group id
   * @param completeMode
   * when true, activate all inactive values from the group
   */
  const toggleMacroFilter = (
    macro: keyof typeof FILTERS_ACTIVITY_MAPPING,
    completeMode = false
  ) => {
    const filters = getFiltersByMacro(macro)
    const isMacroActive = completeMode
      ? filters?.every((filter) => activeFilters.includes(filter))
      : filters?.some((filter) => activeFilters.includes(filter))

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
