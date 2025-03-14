import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { fireEvent, render, screen } from 'tests/utils'

import { DeleteProfileAccountHacked } from './DeleteProfileAccountHacked'

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('DeleteProfileAccountHacked', () => {
  it('should render correctly', () => {
    render(<DeleteProfileAccountHacked />)

    expect(screen).toMatchSnapshot()
  })

  it('should navigate to profile on press ne pas sécuriser mon compte', async () => {
    render(<DeleteProfileAccountHacked />)
    const button = screen.getByText('Ne pas sécuriser mon compte')

    fireEvent.press(button)

    expect(navigate).toHaveBeenCalledWith('TabNavigator', {
      params: {
        params: undefined,
        screen: 'Profile',
      },
      screen: 'ProfileStackNavigator',
    })
  })

  it('should navigate to confirm delete profile on press Susprendre mon compte', async () => {
    render(<DeleteProfileAccountHacked />)
    const button = screen.getByText('Suspendre mon compte')

    fireEvent.press(button)

    expect(navigate).toHaveBeenCalledWith('TabNavigator', {
      params: {
        params: undefined,
        screen: 'SuspendAccountConfirmationWithoutAuthentication',
      },
      screen: 'ProfileStackNavigator',
    })
  })
})
