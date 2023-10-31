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

const falsyState = {
  isQueryProvided: false,
  shouldShowSuggestedVenues: false,
  isVenueSelected: false,
  venueQuery: '',
}
const inputState = {
  isQueryProvided: true,
  shouldShowSuggestedVenues: true,
  isVenueSelected: false,
  venueQuery: venue.label,
}
const selectedState = {
  isQueryProvided: true,
  shouldShowSuggestedVenues: false,
  isVenueSelected: true,
  venueQuery: venue.label,
}

describe('useVenueModal', () => {
  it('when start it should return falsy state', () => {
    const { result } = renderHook(useVenueModal, { initialProps: { dismissModal } })

    const { isQueryProvided, shouldShowSuggestedVenues, isVenueSelected, venueQuery } =
      result.current

    expect({
      isQueryProvided,
      shouldShowSuggestedVenues,
      isVenueSelected,
      venueQuery,
    }).toStrictEqual(falsyState)
  })

  it('when provide a query it should change state for the UI', async () => {
    const { result } = renderHook(useVenueModal, {
      initialProps: { dismissModal },
    })

    await act(async () => {
      result.current.doChangeVenue(venue.label)
    })

    const { isQueryProvided, shouldShowSuggestedVenues, isVenueSelected, venueQuery } =
      result.current

    expect({
      isQueryProvided,
      shouldShowSuggestedVenues,
      isVenueSelected,
      venueQuery,
    }).toStrictEqual(inputState)
  })

  it('when select a venue it should change state for the UI', async () => {
    const { result } = renderHook(useVenueModal, { initialProps: { dismissModal } })

    await act(async () => {
      result.current.doChangeVenue(venue.label)
      result.current.doSetSelectedVenue(venue)
    })

    const { isQueryProvided, shouldShowSuggestedVenues, isVenueSelected, venueQuery } =
      result.current

    expect({
      isQueryProvided,
      shouldShowSuggestedVenues,
      isVenueSelected,
      venueQuery,
    }).toStrictEqual(selectedState)
  })

  it('when select a venue and reset it should reset the UI', async () => {
    const { result } = renderHook(useVenueModal, { initialProps: { dismissModal } })

    await act(async () => {
      result.current.doChangeVenue(venue.label)
      result.current.doSetSelectedVenue(venue)
    })

    await act(async () => {
      result.current.doResetVenue()
    })

    const { isQueryProvided, shouldShowSuggestedVenues, isVenueSelected, venueQuery } =
      result.current

    expect({
      isQueryProvided,
      shouldShowSuggestedVenues,
      isVenueSelected,
      venueQuery,
    }).toStrictEqual(falsyState)
  })

  it('when select a venue and validate it should call the search hook and modal dismiss', async () => {
    const { result } = renderHook(useVenueModal, { initialProps: { dismissModal } })

    await act(async () => {
      result.current.doChangeVenue(venue.label)
      result.current.doSetSelectedVenue(venue)
    })

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
