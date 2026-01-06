import { Activity } from 'api/gen'
import { renderHook } from 'tests/utils'

import { useVenuesFilter, venuesFilterActions } from './venuesFilterStore'

describe('venuesFilterStore', () => {
  it('should get venuesFilters', async () => {
    const { result } = renderHook(() => useVenuesFilter())

    expect(result.current).toEqual([])
  })

  it('should set venuesFilters', async () => {
    venuesFilterActions.setVenuesFilters([Activity.CINEMA])

    const { result: state } = renderHook(() => useVenuesFilter())

    expect(state.current).toEqual([Activity.CINEMA])
  })

  it('should add venuesFilters', async () => {
    venuesFilterActions.setVenuesFilters([Activity.CINEMA])
    venuesFilterActions.addVenuesFilters([Activity.BOOKSTORE, Activity.MUSEUM])
    venuesFilterActions.addVenuesFilters([Activity.BOOKSTORE])

    const { result: state } = renderHook(() => useVenuesFilter())

    expect(state.current).toEqual([Activity.CINEMA, Activity.BOOKSTORE, Activity.MUSEUM])
  })

  it('should remove venuesFilter', async () => {
    venuesFilterActions.setVenuesFilters([Activity.CINEMA])
    venuesFilterActions.addVenuesFilters([Activity.BOOKSTORE])
    venuesFilterActions.removeVenuesFilters([Activity.BOOKSTORE, Activity.CINEMA, Activity.MUSEUM])

    const { result: state } = renderHook(() => useVenuesFilter())

    expect(state.current).toEqual([])
  })

  it('should reset venuesFilter', async () => {
    venuesFilterActions.setVenuesFilters([Activity.CINEMA])
    venuesFilterActions.addVenuesFilters([Activity.BOOKSTORE])
    venuesFilterActions.reset()

    const { result: state } = renderHook(() => useVenuesFilter())

    expect(state.current).toEqual([])
  })
})
