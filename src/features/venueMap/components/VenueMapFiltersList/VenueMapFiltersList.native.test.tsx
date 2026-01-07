import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React from 'react'

import { Activity } from 'api/gen'
import { VenueMapFiltersModalStackParamList } from 'features/navigation/VenueMapFiltersStackNavigator/types'
import { VenueMapFiltersList } from 'features/venueMap/components/VenueMapFiltersList/VenueMapFiltersList'
import { useVenuesFilter } from 'features/venueMap/store/venuesFilterStore'
import { render, screen, userEvent } from 'tests/utils'

const mockNavigate = jest.fn()
const mockGoBack = jest.fn()

const mockNavigation: NativeStackScreenProps<
  VenueMapFiltersModalStackParamList,
  'VenueMapFiltersList'
>['navigation'] = {
  navigate: mockNavigate,
  goBack: mockGoBack,
  dispatch: jest.fn(),
  reset: jest.fn(),
  isFocused: jest.fn(),
  canGoBack: jest.fn(),
  getId: jest.fn(),
  getState: jest.fn(),
  getParent: jest.fn(),
  setParams: jest.fn(),
  setOptions: jest.fn(),
  addListener: jest.fn(),
  removeListener: jest.fn(),
  replace: jest.fn(),
  push: jest.fn(),
  pop: jest.fn(),
  popToTop: jest.fn(),
}

jest.mock('features/venueMap/store/venuesFilterStore')
const mockUseVenuesFilter = useVenuesFilter as jest.Mock
mockUseVenuesFilter.mockReturnValue([])

const user = userEvent.setup()

jest.useFakeTimers()

describe('VenueMapFiltersList', () => {
  it('should render filters list correctly', () => {
    render(
      <VenueMapFiltersList
        navigation={mockNavigation}
        route={{ key: 'VenueMapFiltersList', name: 'VenueMapFiltersList' }}
      />
    )

    expect(screen.getByText('Sorties')).toBeTruthy()
    expect(screen.getByText('Boutiques')).toBeTruthy()
    expect(screen.getByText('Autres')).toBeTruthy()
  })

  it('should navigate to venue map activity filter when pressing a row with filter group information', async () => {
    render(
      <VenueMapFiltersList
        navigation={mockNavigation}
        route={{ key: 'VenueMapFiltersList', name: 'VenueMapFiltersList' }}
      />
    )

    await user.press(screen.getByText('Sorties'))

    expect(mockNavigate).toHaveBeenCalledWith('VenueMapActivityFilter', {
      filterGroup: 'OUTINGS',
      title: 'Sorties',
    })
  })

  it('should trigger goBack when pressing modal close button', async () => {
    render(
      <VenueMapFiltersList
        navigation={mockNavigation}
        route={{ key: 'VenueMapFiltersList', name: 'VenueMapFiltersList' }}
      />
    )

    await user.press(screen.getByLabelText('Fermer'))

    expect(mockGoBack).toHaveBeenCalledTimes(1)
  })

  it('should return "Tout" in each filters when venue filter is empty', () => {
    mockUseVenuesFilter.mockReturnValueOnce([])
    render(
      <VenueMapFiltersList
        navigation={mockNavigation}
        route={{ key: 'VenueMapFiltersList', name: 'VenueMapFiltersList' }}
      />
    )

    const allDescriptions = screen.getAllByText('Tout')

    expect(allDescriptions).toHaveLength(3)
  })

  it('should return venue types in filter descriptions', () => {
    mockUseVenuesFilter.mockReturnValueOnce([
      Activity.FESTIVAL,
      Activity.BOOKSTORE,
      Activity.CULTURAL_CENTRE,
    ])

    render(
      <VenueMapFiltersList
        navigation={mockNavigation}
        route={{ key: 'VenueMapFiltersList', name: 'VenueMapFiltersList' }}
      />
    )

    expect(screen.getByText('Festival')).toBeOnTheScreen()
    expect(screen.getByText('Librairie')).toBeOnTheScreen()
    expect(screen.getByText('Centre culturel')).toBeOnTheScreen()
  })
})
