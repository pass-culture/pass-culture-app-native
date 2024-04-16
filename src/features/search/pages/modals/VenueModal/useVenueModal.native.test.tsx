import { initialSearchState } from 'features/search/context/reducer'
import { SearchView } from 'features/search/types'
import { Venue } from 'features/venue/types'
import { analytics } from 'libs/analytics'
import { mockedSuggestedVenues } from 'libs/venue/fixtures/mockedSuggestedVenues'
import { act, renderHook } from 'tests/utils'

import useVenueModal from './useVenueModal'

const venue: Venue = mockedSuggestedVenues[0]

jest.useFakeTimers()
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

const falsyState = {
  isQueryProvided: false,
  shouldShowSuggestedVenues: false,
  isSearchButtonDisabled: false,
  venueQuery: '',
}
const inputState = {
  isQueryProvided: true,
  shouldShowSuggestedVenues: true,
  isSearchButtonDisabled: true,
  venueQuery: venue.label,
}
const selectedState = {
  isQueryProvided: true,
  shouldShowSuggestedVenues: false,
  isSearchButtonDisabled: false,
  venueQuery: venue.label,
}

describe('useVenueModal', () => {
  it('when start it should return falsy state', () => {
    const { result } = renderHook(useVenueModal, { initialProps: { dismissModal } })

    const { isQueryProvided, shouldShowSuggestedVenues, isSearchButtonDisabled, venueQuery } =
      result.current

    expect({
      isQueryProvided,
      shouldShowSuggestedVenues,
      isSearchButtonDisabled,
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

    const { isQueryProvided, shouldShowSuggestedVenues, isSearchButtonDisabled, venueQuery } =
      result.current

    expect({
      isQueryProvided,
      shouldShowSuggestedVenues,
      isSearchButtonDisabled,
      venueQuery,
    }).toStrictEqual(inputState)
  })

  it('when select a venue it should change state for the UI', async () => {
    const { result } = renderHook(useVenueModal, { initialProps: { dismissModal } })

    await act(async () => {
      result.current.doChangeVenue(venue.label)
      result.current.doSetSelectedVenue(venue)
    })

    const { isQueryProvided, shouldShowSuggestedVenues, isSearchButtonDisabled, venueQuery } =
      result.current

    expect({
      isQueryProvided,
      shouldShowSuggestedVenues,
      isSearchButtonDisabled,
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

    const { isQueryProvided, shouldShowSuggestedVenues, isSearchButtonDisabled, venueQuery } =
      result.current

    expect({
      isQueryProvided,
      shouldShowSuggestedVenues,
      isSearchButtonDisabled,
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
        venue: venue,
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

  it('should trigger logEvent "logUserSetVenue" when doApplySearch', async () => {
    const { result } = renderHook(({ dismissModal }) => useVenueModal({ dismissModal }), {
      initialProps: {
        dismissModal: dismissModal,
      },
    })

    await act(() => {
      result.current.doSetSelectedVenue({ label: 'venueLabel', info: 'info', venueId: 1234 })
    })
    await act(() => {
      result.current.doApplySearch()
    })

    expect(analytics.logUserSetVenue).toHaveBeenCalledWith({ venueLabel: 'venueLabel' })
  })
})
