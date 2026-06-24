import { NavigationContainer } from '@react-navigation/native'
import React from 'react'

import { LocationWidget } from 'features/location/components/LocationWidget'
import { ScreenOrigin } from 'features/location/enums'
import { render, screen, userEvent } from 'tests/utils'

const mockNavigate = jest.fn()

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native')
  return {
    ...actual,
    useNavigation: jest.fn(() => ({ navigate: mockNavigate })),
  }
})

jest.mock('libs/splashscreen/splashscreen')

const user = userEvent.setup()

jest.useFakeTimers()

describe('LocationWidget', () => {
  it('should navigate to home location modal when pressing widget', async () => {
    renderLocationWidget()

    const button = screen.getByTestId('France entière - Ouvrir la modale de localisation')

    await user.press(button)

    expect(mockNavigate).toHaveBeenCalledWith('HomeLocationModal')
  })
})

const renderLocationWidget = () => {
  render(
    <NavigationContainer>
      <LocationWidget screenOrigin={ScreenOrigin.HOME} />
    </NavigationContainer>
  )
}
