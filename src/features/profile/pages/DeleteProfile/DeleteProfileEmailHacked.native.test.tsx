import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { render, screen, userEvent } from 'tests/utils'

import { DeleteProfileEmailHacked } from './DeleteProfileEmailHacked'

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()
jest.useFakeTimers()

describe('DeleteProfileEmailHacked', () => {
  it('should render correctly', () => {
    render(<DeleteProfileEmailHacked />)

    expect(screen).toMatchSnapshot()
  })

  it('should navigate to profile on press ne pas sécuriser mon compte', async () => {
    render(<DeleteProfileEmailHacked />)
    const button = screen.getByText('Ne pas sécuriser mon compte')

    await user.press(button)

    expect(navigate).toHaveBeenCalledWith('TabNavigator', { params: undefined, screen: 'Profile' })
  })

  it('should navigate to change email on press Modifier mon adresse e-mail', async () => {
    render(<DeleteProfileEmailHacked />)
    const button = screen.getByText('Modifier mon adresse e-mail')

    await user.press(button)

    expect(navigate).toHaveBeenCalledWith('TabNavigator', {
      params: { params: undefined, screen: 'ChangeEmail' },
      screen: 'ProfileStackNavigator',
    })
  })

  it('should navigate to confirm delete profile on press Susprendre mon compte', async () => {
    render(<DeleteProfileEmailHacked />)
    const button = screen.getByText('Suspendre mon compte')

    await user.press(button)

    expect(navigate).toHaveBeenCalledWith('TabNavigator', {
      params: {
        params: undefined,
        screen: 'SuspendAccountConfirmationWithoutAuthentication',
      },
      screen: 'ProfileStackNavigator',
    })
  })
})
