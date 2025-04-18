import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { NotificationsLoggedOutModal } from 'features/subscription/NotificationsLoggedOutModal'
import { analytics } from 'libs/analytics/provider'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('features/profile/pages/NotificationSettings/usePushPermission', () => ({
  usePushPermission: jest.fn(() => ({
    pushPermission: 'granted',
  })),
}))

const mockDismissModal = jest.fn()

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()
jest.useFakeTimers()

describe('<NotificationsLoggedOutModal />', () => {
  it('should render correctly', () => {
    renderModal(true)

    expect(screen).toMatchSnapshot()
  })

  it('should dismiss modal on press rightIconButton', async () => {
    renderModal(true)

    const dismissModalButton = screen.getByTestId('rightIcon')

    await user.press(dismissModalButton)

    expect(mockDismissModal).toHaveBeenCalledTimes(1)
  })

  it('should dismiss modal on press "Créer un compte"', async () => {
    renderModal(true)

    const authButton = screen.getByText('Créer un compte')

    await user.press(authButton)

    expect(mockDismissModal).toHaveBeenCalledTimes(1)
  })

  it('should go to sign up page on press "Créer un compte"', async () => {
    renderModal(true)

    const authButton = screen.getByText('Créer un compte')

    await user.press(authButton)

    expect(navigate).toHaveBeenCalledWith('SignupForm', { from: 'thematicHome' })
  })

  it('should dismiss modal on press "Se connecter"', async () => {
    renderModal(true)

    const authButton = screen.getByText('Se connecter')

    await user.press(authButton)

    expect(mockDismissModal).toHaveBeenCalledTimes(1)
  })

  it('should go to login page on press "Se connecter"', async () => {
    renderModal(true)

    const authButton = screen.getByText('Se connecter')

    await user.press(authButton)

    expect(navigate).toHaveBeenCalledWith('Login', { from: 'thematicHome' })
  })

  it('should log analytics when clicking on "Créer un compte" button', async () => {
    renderModal(true)

    const authButton = screen.getByText('Créer un compte')
    await user.press(authButton)

    expect(analytics.logSignUpClicked).toHaveBeenNthCalledWith(1, { from: 'ThematicHome' })
  })

  it('should log analytics when clicking on "Se connecter" button', async () => {
    renderModal(true)

    const authButton = screen.getByText('Se connecter')
    await user.press(authButton)

    expect(analytics.logLoginClicked).toHaveBeenNthCalledWith(1, { from: 'ThematicHome' })
  })
})

const renderModal = (visible: boolean) => {
  render(
    reactQueryProviderHOC(
      <NotificationsLoggedOutModal
        visible={visible}
        dismissModal={mockDismissModal}
        from="ThematicHome"
      />
    )
  )
}
