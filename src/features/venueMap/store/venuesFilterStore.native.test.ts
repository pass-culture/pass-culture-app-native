import { VenueTypeCodeKey } from 'api/gen'
import { renderHook } from 'tests/utils'

import { useVenuesFilter, useVenuesFilterActions } from './venuesFilterStore'

describe('venuesFilterStore', () => {
  it('should get venuesFilters', async () => {
    const { result } = renderHook(() => useVenuesFilter())

    expect(result.current).toEqual([])
  })

  it('should set venuesFilters', async () => {
    const { result } = renderHook(() => useVenuesFilterActions())
    result.current.setVenuesFilters([VenueTypeCodeKey.MOVIE])

    const { result: state } = renderHook(() => useVenuesFilter())

    expect(state.current).toEqual([VenueTypeCodeKey.MOVIE])
  })

  it('should add venuesFilters', async () => {
    const { result } = renderHook(() => useVenuesFilterActions())
    result.current.setVenuesFilters([VenueTypeCodeKey.MOVIE])
    result.current.addVenuesFilters([VenueTypeCodeKey.BOOKSTORE, VenueTypeCodeKey.MUSEUM])
    result.current.addVenuesFilters([VenueTypeCodeKey.BOOKSTORE])

    const { result: state } = renderHook(() => useVenuesFilter())

    expect(state.current).toEqual([
      VenueTypeCodeKey.MOVIE,
      VenueTypeCodeKey.BOOKSTORE,
      VenueTypeCodeKey.MUSEUM,
    ])
  })

  it('should remove venuesFilter', async () => {
    const { result } = renderHook(() => useVenuesFilterActions())
    result.current.setVenuesFilters([VenueTypeCodeKey.MOVIE])
    result.current.addVenuesFilters([VenueTypeCodeKey.BOOKSTORE])
    result.current.removeVenuesFilters([
      VenueTypeCodeKey.BOOKSTORE,
      VenueTypeCodeKey.MOVIE,
      VenueTypeCodeKey.MUSEUM,
    ])

    const { result: state } = renderHook(() => useVenuesFilter())

    expect(state.current).toEqual([])
  })

  it('should reset venuesFilter', async () => {
    const { result } = renderHook(() => useVenuesFilterActions())
    result.current.setVenuesFilters([VenueTypeCodeKey.MOVIE])
    result.current.addVenuesFilters([VenueTypeCodeKey.BOOKSTORE])
    result.current.reset()

    const { result: state } = renderHook(() => useVenuesFilter())

    expect(state.current).toEqual([])
  })
})
