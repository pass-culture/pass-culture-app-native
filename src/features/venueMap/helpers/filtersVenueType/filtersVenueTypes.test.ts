import { VenueTypeCodeKey } from 'api/gen'
import { FILTERS_VENUE_TYPE_MAPPING } from 'features/venueMap/constant'
import {
  getActiveMacros,
  getFiltersByMacro,
} from 'features/venueMap/helpers/filtersVenueType/filtersVenueType'

describe('getFiltersByMacro', () => {
  it('should return filters for a valid macro-section', () => {
    const filters = getFiltersByMacro('OUTINGS')

    expect(filters).toEqual(FILTERS_VENUE_TYPE_MAPPING.OUTINGS)
  })

  it('should return filters for SHOPS', () => {
    const filters = getFiltersByMacro('SHOPS')

    expect(filters).toEqual(FILTERS_VENUE_TYPE_MAPPING.SHOPS)
  })
})

describe('getActiveMacros', () => {
  it('should return macros matching active filters', () => {
    const activeFilters: VenueTypeCodeKey[] = [
        ...(FILTERS_VENUE_TYPE_MAPPING.OUTINGS),
        ...(FILTERS_VENUE_TYPE_MAPPING.SHOPS?.slice(0, 1)),
      ].filter((item): item is VenueTypeCodeKey => Boolean(item))
      
    const activeMacros = getActiveMacros(activeFilters)

    expect(activeMacros).toEqual(['OUTINGS', 'SHOPS'])
  })

  it('should return all macros when all filters are active', () => {
    const activeFilters = Object.values(FILTERS_VENUE_TYPE_MAPPING).flat()
    const activeMacros = getActiveMacros(activeFilters)

    expect(activeMacros).toEqual(Object.keys(FILTERS_VENUE_TYPE_MAPPING))
  })

  it('should handle empty active filters', () => {
    const activeMacros = getActiveMacros([])

    expect(activeMacros).toEqual([])
  })
})
