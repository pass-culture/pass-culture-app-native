import { initialSearchState } from 'features/search/context/reducer'
import { Venue } from 'features/venue/types'
import { mockedSuggestedVenues } from 'libs/venue/fixtures/mockedSuggestedVenues'
import { act, renderHook } from 'tests/utils'

import useVenueModal from './useVenueModal'

const venue: Venue = mockedSuggestedVenues[0]

jest.useFakeTimers({ legacyFakeTimers: true })
jest.mock('ui/hooks/useDebounceValue', () => ({
  useDebounceValue: (value: string) => value,
}))
const mockSearchState = initialSearchState
const mockStateDispatch = jest.fn()
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockStateDispatch,
  }),
}))

const dismissMyModal: VoidFunction = jest.fn()

describe('useVenueModal', () => {
  it('when start it should return falsy state', () => {
    const { result } = renderHook(useVenueModal, { initialProps: dismissMyModal })

    expect(result.current.isQueryProvided).toBeFalsy()
    expect(result.current.shouldShowSuggestedVenues).toBeFalsy()
    expect(result.current.isVenueSelected).toBeFalsy()
    expect(result.current.venueQuery.length).toBe(0)
  })
  it('when provide a query it should change state for the UI', async () => {
    const { result } = renderHook(useVenueModal, { initialProps: dismissMyModal })

    await act(async () => {
      result.current.doChangeVenue('toto')
    })

    expect(result.current.isQueryProvided).toBeTruthy()
    expect(result.current.shouldShowSuggestedVenues).toBeTruthy()
    expect(result.current.isVenueSelected).toBeFalsy()
    expect(result.current.venueQuery.length).toBe(4)
  })
  it('when select a venue it should change state for the UI', async () => {
    const { result } = renderHook(useVenueModal, { initialProps: dismissMyModal })

    await act(async () => {
      result.current.doChangeVenue(venue.label)
      result.current.doSetSelectedVenue(venue)
    })

    expect(result.current.isQueryProvided).toBeTruthy()
    expect(result.current.shouldShowSuggestedVenues).toBeFalsy()
    expect(result.current.isVenueSelected).toBeTruthy()
    expect(result.current.venueQuery.length).toBe(venue.label.length)
  })
  it('when select a venue and reset it should reset the UI', async () => {
    const { result } = renderHook(useVenueModal, { initialProps: dismissMyModal })

    await act(async () => {
      result.current.doChangeVenue(venue.label)
      result.current.doSetSelectedVenue(venue)
    })
    expect(result.current.venueQuery.length).toBe(venue.label.length)

    await act(async () => {
      result.current.doResetVenue()
    })

    expect(result.current.isQueryProvided).toBeFalsy()
    expect(result.current.shouldShowSuggestedVenues).toBeFalsy()
    expect(result.current.isVenueSelected).toBeFalsy()
    expect(result.current.venueQuery.length).toBe(0)
  })
  it('when select a venue and validate it should call the search hook and modal dismiss', async () => {
    const { result } = renderHook(useVenueModal, { initialProps: dismissMyModal })

    await act(async () => {
      result.current.doChangeVenue(venue.label)
      result.current.doSetSelectedVenue(venue)
    })

    expect(dismissMyModal).not.toHaveBeenCalled()

    await act(async () => {
      result.current.doApplySearch()
    })

    expect(dismissMyModal).toHaveBeenCalledWith()
  })
  it('when select a venue and validate it should apply search to the context', async () => {
    const { result } = renderHook(useVenueModal)

    await act(async () => {
      result.current.doChangeVenue(venue.label)
      result.current.doSetSelectedVenue(venue)
    })
    await act(async () => {
      result.current.doApplySearch()
    })
    expect(dismissMyModal).not.toHaveBeenCalled()
    expect(mockStateDispatch).toHaveBeenCalledWith({
      type: 'SET_LOCATION_VENUE',
      payload: venue,
    })
  })
  it('when nothing is to be search then search cannot be done', async () => {
    const { result } = renderHook(useVenueModal)

    await act(async () => {
      result.current.doApplySearch()
    })
    expect(dismissMyModal).not.toHaveBeenCalled()
    expect(mockStateDispatch).not.toHaveBeenCalled()
  })
})
