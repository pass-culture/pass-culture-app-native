import { VenueTypeCodeKey } from 'api/gen'
import { FILTERS_VENUE_TYPE_MAPPING } from 'features/venueMap/constant'
import { useVenuesFilter, useVenuesFilterActions } from 'features/venueMap/store/venuesFilterStore'
import { renderHook } from 'tests/utils'

import { useVenueMapFilters } from './useVenueMapFilters'

jest.mock('features/venueMap/store/venuesFilterStore')

const mockUseVenuesFilter = useVenuesFilter as jest.Mock
const mockUseVenuesFilterActions = useVenuesFilterActions as jest.Mock
const mockSetVenuesFilters = jest.fn()
const mockAddVenuesFilters = jest.fn()
const mockRemoveVenuesFilters = jest.fn()

describe('useVenueMapFilters', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseVenuesFilter.mockReturnValue([])
    mockUseVenuesFilterActions.mockReturnValue({
      setVenuesFilters: mockSetVenuesFilters,
      addVenuesFilters: mockAddVenuesFilters,
      removeVenuesFilters: mockRemoveVenuesFilters,
    })
  })

  it('should initialize with no active filters', () => {
    const { result } = renderHook(() => useVenueMapFilters())

    expect(result.current.activeFilters).toEqual([])
  })

  it('should apply macro filters correctly', () => {
    const { result } = renderHook(() => useVenueMapFilters())

    result.current.applyMacroFilters('OUTINGS')

    expect(mockSetVenuesFilters).toHaveBeenCalledWith(FILTERS_VENUE_TYPE_MAPPING.OUTINGS)
  })

  it('should toggle a filter correctly (add filter)', () => {
    mockUseVenuesFilter.mockReturnValueOnce([])

    const { result } = renderHook(() => useVenueMapFilters())
    const filterToAdd = VenueTypeCodeKey.CONCERT_HALL

    result.current.toggleFilter(filterToAdd)

    expect(mockAddVenuesFilters).toHaveBeenCalledWith([filterToAdd])
  })

  it('should toggle a filter correctly (remove filter)', () => {
    mockUseVenuesFilter.mockReturnValueOnce([VenueTypeCodeKey.CONCERT_HALL])

    const { result } = renderHook(() => useVenueMapFilters())
    const filterToRemove = VenueTypeCodeKey.CONCERT_HALL

    result.current.toggleFilter(filterToRemove)

    expect(mockRemoveVenuesFilters).toHaveBeenCalledWith([filterToRemove])
  })

  it('should return selected macros correctly', () => {
    mockUseVenuesFilter.mockReturnValueOnce([
      VenueTypeCodeKey.CONCERT_HALL,
      VenueTypeCodeKey.BOOKSTORE,
    ])

    const { result } = renderHook(() => useVenueMapFilters())
    const selectedMacros = result.current.getSelectedMacros()

    expect(selectedMacros).toEqual(['OUTINGS', 'SHOPS'])
  })
})
