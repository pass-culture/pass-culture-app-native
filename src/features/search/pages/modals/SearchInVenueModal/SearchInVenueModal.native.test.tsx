import * as reactNavigationNative from '@react-navigation/native'
import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { Activity } from 'api/gen'
import { initialSearchState } from 'features/search/context/reducer'
import { Venue } from 'features/venue/types'
import { render, screen, userEvent } from 'tests/utils'

import { SearchInVenueModal } from './SearchInVenueModal'

const venueId = 123
const venueName = 'Test Venue'

const venueSelected: Venue = {
  label: venueName,
  venueId,
  _geoloc: { lat: 48.8566, lng: 2.3522 },
  banner_url: '',
  postalCode: '75000',
  isPermanent: true,
  isOpenToPublic: true,
  activity: Activity.BOOKSTORE,
  info: '',
}
const mockNavigate = jest.fn()

useRoute.mockImplementationOnce(() => ({ params: { id: venueId } }))

jest.spyOn(reactNavigationNative, 'useNavigation').mockReturnValue({
  navigate: mockNavigate,
  push: jest.fn(),
})

const mockDismissModal = jest.fn()
const defaultProps = {
  visible: true,
  dismissModal: mockDismissModal,
  venueSelected,
  onBeforeNavigate: jest.fn(),
}

const mockUseSearch = jest.fn(() => ({
  searchState: initialSearchState,
  dispatch: jest.fn(),
}))
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => mockUseSearch(),
}))

const user = userEvent.setup()
jest.useFakeTimers()

describe('<SearchInVenueModal />', () => {
  it('should dismiss modal when pressing close icon', async () => {
    render(<SearchInVenueModal {...defaultProps} />)
    await user.press(screen.getByLabelText('Fermer la modale'))

    expect(mockDismissModal).toHaveBeenCalledTimes(1)
  })

  it('should dismiss modal when pressing "Lancer la recherche" with a query', async () => {
    render(<SearchInVenueModal {...defaultProps} />)

    await user.type(screen.getByTestId('searchInput'), 'Martine')
    await user.press(screen.getByText('Lancer la recherche'))

    expect(mockDismissModal).toHaveBeenCalledTimes(1)
  })

  it('should navigate to search results with query and selected venue when pressing "Lancer la recherche" with a query', async () => {
    render(<SearchInVenueModal {...defaultProps} />)

    await user.type(screen.getByTestId('searchInput'), 'Martine')
    await screen.findByDisplayValue('Martine')

    expect(await screen.findByText('Lancer la recherche')).not.toBeDisabled()

    await user.press(screen.getByText('Lancer la recherche'))

    expect(mockNavigate).toHaveBeenCalledWith('TabNavigator', {
      screen: 'SearchStackNavigator',
      params: {
        screen: 'SearchResults',
        params: {
          ...initialSearchState,
          venue: venueSelected,
          query: 'Martine',
          accessibilityFilter: {
            isAudioDisabilityCompliant: undefined,
            isMentalDisabilityCompliant: undefined,
            isMotorDisabilityCompliant: undefined,
            isVisualDisabilityCompliant: undefined,
          },
        },
      },
    })
  })
})
