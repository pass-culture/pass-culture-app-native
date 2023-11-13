import React from 'react'

import { initialSearchState } from 'features/search/context/reducer'
import * as SearchWrapper from 'features/search/context/SearchWrapper'
import { LocationType } from 'features/search/enums'
import { VenueModal } from 'features/search/pages/modals/VenueModal/VenueModal'
import { SearchState } from 'features/search/types'
import { Venue } from 'features/venue/types'
import { analytics } from 'libs/analytics'
import { fireEvent, render, screen, waitForModalToShow } from 'tests/utils'

const dismissModalMock = jest.fn()

const mockVenues: Venue[] = [{ label: 'venueLabel', info: 'info', venueId: 1234 }]

const mockSearchState: SearchState = {
  ...initialSearchState,
  locationFilter: { locationType: LocationType.VENUE, venue: mockVenues[0] },
}

jest.mock('libs/place', () => ({
  useVenues: () => ({ data: mockVenues, isLoading: false }),
}))

describe('VenueModal', () => {
  it('should render correctly', async () => {
    render(<VenueModal visible dismissModal={dismissModalMock} />)
    await waitForModalToShow()

    expect(screen).toMatchSnapshot()
  })

  it('should close when pressing the close button', async () => {
    render(<VenueModal visible dismissModal={dismissModalMock} />)
    await waitForModalToShow()

    const closeButton = screen.getByLabelText('Fermer la modale')
    fireEvent.press(closeButton)

    expect(dismissModalMock).toHaveBeenCalledTimes(1)
  })

  it('should trigger logEvent "logUserSetVenue" when pressing "Valider le lieu culturel" button', async () => {
    render(<VenueModal visible dismissModal={dismissModalMock} />)
    await waitForModalToShow()

    const searchInput = screen.getByTestId('styled-input-container')
    fireEvent.changeText(searchInput, mockVenues[0].label)

    const suggestedVenue = await screen.findByText(mockVenues[0].label)
    fireEvent.press(suggestedVenue)

    const validateButon = screen.getByText('Rechercher')
    fireEvent.press(validateButon)

    expect(analytics.logUserSetVenue).toHaveBeenCalledWith({ venueLabel: mockVenues[0].label })
  })

  it('should be initialized with the venue label when a venue is already selected and venue modal is opened', async () => {
    const mockedUseSearch = jest.spyOn(SearchWrapper, 'useSearch')
    mockedUseSearch.mockReturnValueOnce({ searchState: mockSearchState, dispatch: jest.fn() })
    render(<VenueModal visible dismissModal={dismissModalMock} />)

    await waitForModalToShow()

    const venueSearchInput = screen.getByTestId('searchInput')

    // search input's prop 'value' is not showing in the DOM because of forwardRef
    expect(venueSearchInput.props.value).toEqual(mockVenues[0].label)
  })

  it('should be initialized with the venue label when a venue is already selected, input was cleared, modal was closed and then opened', async () => {
    const mockedUseSearch = jest.spyOn(SearchWrapper, 'useSearch')
    mockedUseSearch // it rerenders multiple(3) time so it needs multiple(3) mocks
      .mockReturnValueOnce({ searchState: mockSearchState, dispatch: jest.fn() })
      .mockReturnValueOnce({ searchState: mockSearchState, dispatch: jest.fn() })
      .mockReturnValueOnce({ searchState: mockSearchState, dispatch: jest.fn() })

    render(<VenueModal visible dismissModal={dismissModalMock} />)

    await waitForModalToShow()
    const venueSearchInput = screen.getByTestId('searchInput')

    expect(venueSearchInput.props.value).toEqual(mockVenues[0].label) // because of forwardRef, it's not possible to do a getbytext so we use an expect to be sure that Venue label is there

    const clearInput = screen.getByRole('button', { name: 'Réinitialiser la recherche' })
    fireEvent.press(clearInput)

    const closeButton = screen.getByRole('button', { name: 'Fermer la modale' })
    fireEvent.press(closeButton)

    expect(venueSearchInput.props.value).toEqual(mockVenues[0].label)
  })
})
