import React from 'react'
import { Button } from 'react-native'

import { initialSearchState } from 'features/search/context/reducer'
import * as SearchWrapper from 'features/search/context/SearchWrapper'
import { VenueModal } from 'features/search/pages/modals/VenueModal/VenueModal'
import { SearchState } from 'features/search/types'
import { Venue } from 'features/venue/types'
import { analytics } from 'libs/analytics'
import { MODAL_TO_SHOW_TIME } from 'tests/constants'
import { act, fireEvent, render, screen } from 'tests/utils'

jest.mock('libs/network/NetInfoWrapper')

jest.useFakeTimers()

const dismissModalMock = jest.fn()

const mockVenues = [
  { label: 'venueLabel', info: 'info', venueId: 1234 },
] as const satisfies readonly Venue[]

jest.mock('libs/place/useVenues', () => ({
  useVenues: () => ({ data: mockVenues, isLoading: false }),
}))

jest.mock('libs/itinerary/useItinerary')

const mockSearchState: SearchState = {
  ...initialSearchState,
  venue: mockVenues[0],
}
const mockedSearchWrapper = {
  searchState: mockSearchState,
  dispatch: jest.fn(),
  resetSearch: jest.fn(),
  hideSuggestions: jest.fn(),
  showSuggestions: jest.fn(),
  isFocusOnSuggestions: false,
}

const mockedUseSearch = jest.spyOn(SearchWrapper, 'useSearch')
mockedUseSearch.mockReturnValue(mockedSearchWrapper)

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('VenueModal', () => {
  it('should render correctly', async () => {
    render(<VenueModal visible dismissModal={dismissModalMock} />)
    jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)

    expect(screen).toMatchSnapshot()
  })

  it('should close when pressing the close button', async () => {
    render(<VenueModal visible dismissModal={dismissModalMock} />)
    jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)

    const closeButton = screen.getByLabelText('Fermer la modale')
    fireEvent.press(closeButton)

    expect(dismissModalMock).toHaveBeenCalledTimes(1)
  })

  it('should trigger logEvent "logUserSetVenue" when pressing "Valider le lieu culturel" button', async () => {
    render(<VenueModal visible dismissModal={dismissModalMock} />)
    jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)

    const venueSearchInput = screen.getByTestId('searchInput')

    fireEvent.changeText(venueSearchInput, mockVenues[0].label)

    const suggestedVenue = await screen.findByText(mockVenues[0].label)
    fireEvent.press(suggestedVenue)

    const validateButton = screen.getByText('Rechercher')
    fireEvent.press(validateButton)

    expect(analytics.logUserSetVenue).toHaveBeenCalledWith({ venueLabel: mockVenues[0].label })
  })

  it('should be initialized with the venue label when a venue is already selected and venue modal is opened', async () => {
    mockedUseSearch
      .mockReturnValueOnce(mockedSearchWrapper)
      .mockReturnValueOnce(mockedSearchWrapper)
    render(<VenueModal visible dismissModal={dismissModalMock} />)

    jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)

    const venueSearchInput = screen.getByTestId('searchInput')

    // search input's prop 'value' is not showing in the DOM because of forwardRef

    expect(venueSearchInput.props.value).toEqual(mockVenues[0].label)
  })

  it('should be initialized with the venue label when a venue is already selected, input was cleared, modal was closed and then opened', async () => {
    mockedUseSearch // it rerenders multiple(4) time so it needs multiple(4) mocks
      .mockReturnValueOnce(mockedSearchWrapper)
      .mockReturnValueOnce(mockedSearchWrapper)
      .mockReturnValueOnce(mockedSearchWrapper)
      .mockReturnValueOnce(mockedSearchWrapper)

    render(<VenueModal visible dismissModal={dismissModalMock} />)

    jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)
    const venueSearchInput = screen.getByTestId('searchInput')

    expect(venueSearchInput.props.value).toEqual(mockVenues[0].label) // because of forwardRef, it's not possible to do a getbytext so we use an expect to be sure that Venue label is there

    const clearInput = screen.getByRole('button', { name: 'Réinitialiser la recherche' })
    fireEvent.press(clearInput)

    const closeButton = screen.getByRole('button', { name: 'Fermer la modale' })
    fireEvent.press(closeButton)

    expect(venueSearchInput.props.value).toEqual(mockVenues[0].label)
  })

  it('should not display venue suggestion when a venue is already selected before opening the modal', async () => {
    mockedUseSearch // it rerenders multiple(3) time so it needs multiple(3) mocks
      .mockReturnValueOnce(mockedSearchWrapper)
      .mockReturnValueOnce(mockedSearchWrapper)
      .mockReturnValueOnce(mockedSearchWrapper)

    render(<VenueModal visible dismissModal={dismissModalMock} />)

    jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)

    const venueSearchInput = screen.getByTestId('searchInput')

    expect(venueSearchInput.props.value).toEqual(mockVenues[0].label)
  })

  it('should not display a venue label if a venue is no longer selected', async () => {
    mockedUseSearch.mockRestore()

    renderDummyComponent()

    const venueSearchInput = screen.getByTestId('searchInput')

    fireEvent.changeText(venueSearchInput, mockVenues[0].label)

    const suggestedVenue = await screen.findByText(mockVenues[0].label)
    fireEvent.press(suggestedVenue)

    await act(() => {
      const validateButton = screen.getByText('Rechercher')
      fireEvent.press(validateButton)
    })

    expect(venueSearchInput.props.value).toEqual(mockVenues[0].label)

    const setLocationVenueUndefinedButton = screen.getByText('setLocationVenueUndefined')
    fireEvent.press(setLocationVenueUndefinedButton)

    await act(() => {})

    expect(venueSearchInput.props.value).toEqual('')
  })
})

const renderDummyComponent = () => {
  render(
    <SearchWrapper.SearchWrapper>
      <DummyComponent />
    </SearchWrapper.SearchWrapper>
  )
}

const DummyComponent = () => {
  const { searchState, dispatch } = SearchWrapper.useSearch()
  return (
    <React.Fragment>
      <VenueModal visible dismissModal={jest.fn()} />
      <Button
        title="setLocationVenueUndefined"
        onPress={() =>
          dispatch({
            type: 'SET_STATE',
            payload: { ...searchState, venue: undefined },
          })
        }
      />
    </React.Fragment>
  )
}
