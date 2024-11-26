import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { VenueMapFiltersModalStackParamList } from 'features/navigation/VenueMapFiltersStackNavigator/types'
import { VenueMapTypeFilter } from 'features/venueMap/components/VenueMapTypeFilter/VenueMapTypeFilter'
import { render, screen, userEvent } from 'tests/utils'

const mockGoBack = jest.fn()

const mockNavigation: StackScreenProps<
  VenueMapFiltersModalStackParamList,
  'VenueMapTypeFilter'
>['navigation'] = {
  navigate: jest.fn(),
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

const user = userEvent.setup()

jest.useFakeTimers()

describe('VenueMapTypeFilter', () => {
  it('should navigate to venue map when pressing modal close button', async () => {
    render(
      <VenueMapTypeFilter
        navigation={mockNavigation}
        route={{ key: 'VenueMapTypeFilter', name: 'VenueMapTypeFilter' }}
      />
    )

    await user.press(screen.getByLabelText('Fermer'))

    expect(navigate).toHaveBeenNthCalledWith(1, 'VenueMap')
  })

  it('should trigger goBack when pressing modal back button', async () => {
    render(
      <VenueMapTypeFilter
        navigation={mockNavigation}
        route={{ key: 'VenueMapTypeFilter', name: 'VenueMapTypeFilter' }}
      />
    )

    await user.press(screen.getByLabelText('Revenir en arrière'))

    expect(mockGoBack).toHaveBeenCalledTimes(1)
  })
})
