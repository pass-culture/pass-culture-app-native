import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import * as OpenUrlAPI from 'features/navigation/helpers/openUrl'
import { env } from 'libs/environment/fixtures'
import { fireEvent, render, screen } from 'tests/utils'

import { DeleteProfileAccountNotDeletable } from './DeleteProfileAccountNotDeletable'

const openUrl = jest.spyOn(OpenUrlAPI, 'openUrl')

jest.mock('libs/firebase/analytics/analytics')
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')
jest.mock('@batch.com/react-native-plugin', () =>
  jest.requireActual('__mocks__/libs/react-native-batch')
)
jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))
jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('DeleteProfileAccountNotDeletable', () => {
  it('should render correctly', () => {
    render(<DeleteProfileAccountNotDeletable />)

    expect(screen).toMatchSnapshot()
  })

  it('should navigate to profile on press Retourner sur mon profil', async () => {
    render(<DeleteProfileAccountNotDeletable />)

    const button = screen.getByText('Retourner sur mon profil')
    fireEvent.press(button)

    expect(navigate).toHaveBeenCalledWith('TabNavigator', { params: undefined, screen: 'Profile' })
  })

  it('should navigate to notifications settings on press Désactiver mes notifications', async () => {
    render(<DeleteProfileAccountNotDeletable />)

    const button = screen.getByText('Désactiver mes notifications')
    fireEvent.press(button)

    expect(navigate).toHaveBeenCalledWith('NotificationsSettings')
  })

  it('should open FAQ link when clicking on "consultant cette page" button', () => {
    render(<DeleteProfileAccountNotDeletable />)

    const faqButton = screen.getByText('consultant cette page.')
    fireEvent.press(faqButton)

    expect(openUrl).toHaveBeenNthCalledWith(1, env.FAQ_LINK_RIGHT_TO_ERASURE, undefined, true)
  })
})
