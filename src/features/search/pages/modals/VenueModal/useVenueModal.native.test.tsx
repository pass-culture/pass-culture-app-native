import { initialSearchState } from 'features/search/context/reducer'
import { LocationType } from 'features/search/enums'
import { VenueModalHookCallback } from 'features/search/pages/modals/VenueModal/type'
import { SearchView } from 'features/search/types'
import { Venue } from 'features/venue/types'
import { analytics } from 'libs/analytics'
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

const dismissModal: VoidFunction = jest.fn()
const doAfterSearch: VenueModalHookCallback = jest.fn()

describe('useVenueModal', () => {
  it('when start it should return falsy state', () => {
    const { result } = renderHook(useVenueModal, { initialProps: { dismissModal } })

    expect(result.current.isQueryProvided).toBeFalsy()
    expect(result.current.shouldShowSuggestedVenues).toBeFalsy()
    expect(result.current.isVenueSelected).toBeFalsy()
    expect(result.current.venueQuery).toHaveLength(0)
  })

  it('when provide a query it should change state for the UI', async () => {
    const { result } = renderHook(useVenueModal, {
      initialProps: { dismissModal },
    })

    await act(async () => {
      result.current.doChangeVenue('toto')
    })

    expect(result.current.isQueryProvided).toBeTruthy()
    expect(result.current.shouldShowSuggestedVenues).toBeTruthy()
    expect(result.current.isVenueSelected).toBeFalsy()
    expect(result.current.venueQuery).toHaveLength(4)
  })

  it('when select a venue it should change state for the UI', async () => {
    const { result } = renderHook(useVenueModal, { initialProps: { dismissModal } })

    await act(async () => {
      result.current.doChangeVenue(venue.label)
      result.current.doSetSelectedVenue(venue)
    })

    expect(result.current.isQueryProvided).toBeTruthy()
    expect(result.current.shouldShowSuggestedVenues).toBeFalsy()
    expect(result.current.isVenueSelected).toBeTruthy()
    expect(result.current.venueQuery).toHaveLength(venue.label.length)
  })

  it('when select a venue and reset it should reset the UI', async () => {
    const { result } = renderHook(useVenueModal, { initialProps: { dismissModal } })

    await act(async () => {
      result.current.doChangeVenue(venue.label)
      result.current.doSetSelectedVenue(venue)
    })

    expect(result.current.venueQuery).toHaveLength(venue.label.length)

    await act(async () => {
      result.current.doResetVenue()
    })

    expect(result.current.isQueryProvided).toBeFalsy()
    expect(result.current.shouldShowSuggestedVenues).toBeFalsy()
    expect(result.current.isVenueSelected).toBeFalsy()
    expect(result.current.venueQuery).toHaveLength(0)
  })

  it('when select a venue and validate it should call the search hook and modal dismiss', async () => {
    const { result } = renderHook(useVenueModal, { initialProps: { dismissModal } })

    await act(async () => {
      result.current.doChangeVenue(venue.label)
      result.current.doSetSelectedVenue(venue)
    })

    expect(dismissModal).not.toHaveBeenCalledWith()

    await act(async () => {
      result.current.doApplySearch()
    })

    expect(dismissModal).toHaveBeenCalledWith()
  })

  it('when select a venue and validate it should apply search to the context', async () => {
    const { result } = renderHook(useVenueModal, { initialProps: { dismissModal } })

    await act(async () => {
      result.current.doChangeVenue(venue.label)
      result.current.doSetSelectedVenue(venue)
    })
    await act(async () => {
      result.current.doApplySearch()
    })

    expect(dismissModal).toHaveBeenCalledWith()
    expect(mockStateDispatch).toHaveBeenCalledWith({
      type: 'SET_STATE',
      payload: {
        ...initialSearchState,
        locationFilter: { locationType: LocationType.VENUE, venue: venue },
        view: SearchView.Results,
      },
    })
  })

  it('when nothing is to be search then search cannot be done', async () => {
    const { result } = renderHook(useVenueModal, { initialProps: { dismissModal } })

    await act(async () => {
      result.current.doApplySearch()
    })

    expect(doAfterSearch).not.toHaveBeenCalledWith()
    expect(dismissModal).toHaveBeenCalledWith()
    expect(mockStateDispatch).not.toHaveBeenCalledWith()
  })

  it('when nothing is to be search then search cannot be done and no calls is made', async () => {
    const { result } = renderHook(
      ({ dismissModal, doAfterSearch }) => useVenueModal({ dismissModal, doAfterSearch }),
      {
        initialProps: {
          dismissModal,
          doAfterSearch: doAfterSearch,
        },
      }
    )

    await act(async () => {
      result.current.doApplySearch()
    })

    expect(doAfterSearch).not.toHaveBeenCalledWith()
    expect(dismissModal).toHaveBeenCalledWith()
    expect(mockStateDispatch).not.toHaveBeenCalledWith()
  })

  it('when a search is made then the callback is called', () => {
    const { result } = renderHook(
      ({ dismissModal, doAfterSearch }) => useVenueModal({ dismissModal, doAfterSearch }),
      {
        initialProps: {
          dismissModal,
          doAfterSearch,
        },
      }
    )
    act(() => {
      result.current.doChangeVenue(venue.label)
      result.current.doSetSelectedVenue(venue)
    })
    act(() => {
      result.current.doApplySearch()
    })

    expect(doAfterSearch).toHaveBeenCalledWith({
      ...initialSearchState,
      locationFilter: { locationType: LocationType.VENUE, venue: venue },
      view: SearchView.Results,
    })
  })

  it('should trigger logEvent "logUserSetVenue" when doApplySearch', async () => {
    const { result } = renderHook(
      ({ dismissModal, doAfterSearch }) => useVenueModal({ dismissModal, doAfterSearch }),
      {
        initialProps: {
          dismissModal: dismissModal,
          doAfterSearch,
        },
      }
    )

    await act(() => {
      result.current.doSetSelectedVenue({ label: 'venueLabel', info: 'info', venueId: 1234 })
    })
    await act(() => {
      result.current.doApplySearch()
    })

    expect(analytics.logUserSetVenue).toHaveBeenCalledWith({ venueLabel: 'venueLabel' })
  })
})
