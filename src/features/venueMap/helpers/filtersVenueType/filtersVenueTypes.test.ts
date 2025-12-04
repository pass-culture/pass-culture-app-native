import { Activity } from 'api/gen'
import { FILTERS_ACTIVITY_MAPPING } from 'features/venueMap/constant'
import {
  getActiveMacroFilters,
  getFiltersByMacro,
} from 'features/venueMap/helpers/filtersVenueType/filtersVenueType'

describe('getFiltersByMacro', () => {
  it('should return filters for a valid macro-section', () => {
    const filters = getFiltersByMacro('OUTINGS')

    expect(filters).toEqual(FILTERS_ACTIVITY_MAPPING.OUTINGS)
  })

  it('should return filters for SHOPS', () => {
    const filters = getFiltersByMacro('SHOPS')

    expect(filters).toEqual(FILTERS_ACTIVITY_MAPPING.SHOPS)
  })
})

describe('getActiveMacroFilters', () => {
  it('should return macros matching active filters', () => {
    const activeFilters: Activity[] = [
      ...FILTERS_ACTIVITY_MAPPING.OUTINGS,
      ...(FILTERS_ACTIVITY_MAPPING.SHOPS?.slice(0, 1) || []),
    ].filter((item): item is Activity => Boolean(item))

    const activeMacros = getActiveMacroFilters(activeFilters)

    expect(activeMacros).toEqual(['OUTINGS', 'SHOPS'])
  })

  it('should return all macros when all filters are active', () => {
    const activeFilters = Object.values(FILTERS_ACTIVITY_MAPPING).flat()
    const activeMacros = getActiveMacroFilters(activeFilters)

    expect(activeMacros).toEqual(Object.keys(FILTERS_ACTIVITY_MAPPING))
  })

  it('should handle empty active filters', () => {
    const activeMacros = getActiveMacroFilters([])

    expect(activeMacros).toEqual([])
  })
})
