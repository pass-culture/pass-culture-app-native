import { VenueTypeCodeKey } from 'api/gen'
import { FILTERS_VENUE_TYPE_MAPPING } from 'features/venueMap/constant'
import { act, renderHook } from 'tests/utils'

import { useVenueMapFilters } from './useVenueMapFilters'

describe('useVenueMapFilters', () => {
  it('should initialize with no active filters', () => {
    const { result } = renderHook(() => useVenueMapFilters())

    expect(result.current.activeFilters).toEqual([])
  })

  it('should add macro filters correctly', () => {
    const { result } = renderHook(() => useVenueMapFilters())

    act(() => {
      result.current.addMacroFilter('OUTINGS')
    })

    act(() => {
      result.current.addMacroFilter('SHOPS')
    })

    expect(result.current.activeFilters).toMatchObject([
      ...FILTERS_VENUE_TYPE_MAPPING.OUTINGS,
      ...FILTERS_VENUE_TYPE_MAPPING.SHOPS,
    ])
  })

  it('should remove macro filters correctly', () => {
    const { result } = renderHook(() => useVenueMapFilters())

    act(() => {
      result.current.addMacroFilter('OUTINGS')
    })

    act(() => {
      result.current.addMacroFilter('SHOPS')
    })

    act(() => {
      result.current.removeMacroFilter('SHOPS')
    })

    expect(result.current.activeFilters).toMatchObject(FILTERS_VENUE_TYPE_MAPPING.OUTINGS)
  })

  it('should toggle a filter correctly (add filter)', () => {
    const { result } = renderHook(() => useVenueMapFilters())
    const filterToAdd = VenueTypeCodeKey.CONCERT_HALL

    act(() => {
      result.current.toggleFilter(filterToAdd)
    })

    expect(result.current.activeFilters).toMatchObject([filterToAdd])
  })

  it('should toggle a filter correctly (remove filter)', () => {
    const { result } = renderHook(() => useVenueMapFilters())
    const filterToRemove = VenueTypeCodeKey.CONCERT_HALL

    act(() => {
      result.current.toggleFilter(filterToRemove)
    })

    act(() => {
      result.current.toggleFilter(filterToRemove)
    })

    expect(result.current.activeFilters).toHaveLength(0)
  })

  it('should return selected macros correctly', () => {
    const { result } = renderHook(() => useVenueMapFilters())

    act(() => {
      result.current.toggleFilter(VenueTypeCodeKey.CONCERT_HALL)
    })

    act(() => {
      result.current.toggleFilter(VenueTypeCodeKey.BOOKSTORE)
    })

    const selectedMacros = result.current.getSelectedMacroFilters()

    expect(selectedMacros).toEqual(['OUTINGS', 'SHOPS'])
  })
})
