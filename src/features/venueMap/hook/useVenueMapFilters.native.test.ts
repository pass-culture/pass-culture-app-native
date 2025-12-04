import { Activity } from 'api/gen'
import { FILTERS_ACTIVITY_MAPPING } from 'features/venueMap/constant'
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
      ...FILTERS_ACTIVITY_MAPPING.OUTINGS,
      ...FILTERS_ACTIVITY_MAPPING.SHOPS,
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

    expect(result.current.activeFilters).toMatchObject(FILTERS_ACTIVITY_MAPPING.OUTINGS)
  })

  it('should toggle a filter correctly (add filter)', () => {
    const { result } = renderHook(() => useVenueMapFilters())

    act(() => {
      result.current.toggleMacroFilter('OUTINGS')
    })

    expect(result.current.activeFilters).toMatchObject([
      Activity.ART_GALLERY,
      Activity.CINEMA,
      Activity.FESTIVAL,
      Activity.GAMES_CENTRE,
      Activity.LIBRARY,
      Activity.MUSEUM,
      Activity.PERFORMANCE_HALL,
    ])
  })

  it('should toggle a filter correctly (remove filter)', () => {
    const { result } = renderHook(() => useVenueMapFilters())

    act(() => {
      result.current.toggleMacroFilter('OUTINGS')
    })

    act(() => {
      result.current.toggleMacroFilter('OUTINGS')
    })

    expect(result.current.activeFilters).toHaveLength(0)
  })

  it('should toggle a filter correctly (complete mode)', () => {
    const { result } = renderHook(() => useVenueMapFilters())

    act(() => {
      result.current.toggleMacroFilter('OUTINGS', true)
    })

    const selectedMacros = result.current.getSelectedMacroFilters()

    expect(selectedMacros).toEqual(['OUTINGS'])
    expect(result.current.activeFilters).toMatchObject([...FILTERS_ACTIVITY_MAPPING.OUTINGS])
  })

  it('should return selected macros correctly', () => {
    const { result } = renderHook(() => useVenueMapFilters())

    act(() => {
      result.current.toggleMacroFilter('OUTINGS')
    })

    act(() => {
      result.current.toggleMacroFilter('SHOPS')
    })

    const selectedMacros = result.current.getSelectedMacroFilters()

    expect(selectedMacros).toEqual(['OUTINGS', 'SHOPS'])
  })
})
