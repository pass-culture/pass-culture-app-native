import { VenueTypeCodeKey } from 'api/gen'
import { renderHook } from 'tests/utils'

import { useVenuesFilter, venuesFilterActions } from './venuesFilterStore'

describe('venuesFilterStore', () => {
  it('should get venuesFilters', async () => {
    const { result } = renderHook(() => useVenuesFilter())

    expect(result.current).toEqual([])
  })

  it('should set venuesFilters', async () => {
    venuesFilterActions.setVenuesFilters([VenueTypeCodeKey.MOVIE])

    const { result: state } = renderHook(() => useVenuesFilter())

    expect(state.current).toEqual([VenueTypeCodeKey.MOVIE])
  })

  it('should add venuesFilters', async () => {
    venuesFilterActions.setVenuesFilters([VenueTypeCodeKey.MOVIE])
    venuesFilterActions.addVenuesFilters([VenueTypeCodeKey.BOOKSTORE, VenueTypeCodeKey.MUSEUM])
    venuesFilterActions.addVenuesFilters([VenueTypeCodeKey.BOOKSTORE])

    const { result: state } = renderHook(() => useVenuesFilter())

    expect(state.current).toEqual([
      VenueTypeCodeKey.MOVIE,
      VenueTypeCodeKey.BOOKSTORE,
      VenueTypeCodeKey.MUSEUM,
    ])
  })

  it('should remove venuesFilter', async () => {
    venuesFilterActions.setVenuesFilters([VenueTypeCodeKey.MOVIE])
    venuesFilterActions.addVenuesFilters([VenueTypeCodeKey.BOOKSTORE])
    venuesFilterActions.removeVenuesFilters([
      VenueTypeCodeKey.BOOKSTORE,
      VenueTypeCodeKey.MOVIE,
      VenueTypeCodeKey.MUSEUM,
    ])

    const { result: state } = renderHook(() => useVenuesFilter())

    expect(state.current).toEqual([])
  })

  it('should reset venuesFilter', async () => {
    venuesFilterActions.setVenuesFilters([VenueTypeCodeKey.MOVIE])
    venuesFilterActions.addVenuesFilters([VenueTypeCodeKey.BOOKSTORE])
    venuesFilterActions.reset()

    const { result: state } = renderHook(() => useVenuesFilter())

    expect(state.current).toEqual([])
  })
})
