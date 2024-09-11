import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { fireEvent, render, screen } from 'tests/utils'

import { DeleteProfileEmailHacked } from './DeleteProfileEmailHacked'

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('DeleteProfileEmailHacked', () => {
  it('should render correctly', () => {
    render(<DeleteProfileEmailHacked />)

    expect(screen).toMatchSnapshot()
  })

  it('should navigate to profile on press ne pas sécuriser mon compte', async () => {
    render(<DeleteProfileEmailHacked />)
    const button = screen.getByText('Ne pas sécuriser mon compte')

    fireEvent.press(button)

    expect(navigate).toHaveBeenCalledWith('TabNavigator', { params: undefined, screen: 'Profile' })
  })

  it('should navigate to change email on press Modifier mon adresse e-mail', async () => {
    render(<DeleteProfileEmailHacked />)
    const button = screen.getByText('Modifier mon adresse e-mail')

    fireEvent.press(button)

    expect(navigate).toHaveBeenCalledWith('ChangeEmail')
  })

  it('should navigate to confirm delete profile on press Susprendre mon compte', async () => {
    render(<DeleteProfileEmailHacked />)
    const button = screen.getByText('Suspendre mon compte')

    fireEvent.press(button)

    expect(navigate).toHaveBeenCalledWith('SuspendAccountConfirmationNoToken')
  })
})
