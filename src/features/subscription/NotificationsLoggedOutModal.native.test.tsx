import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { NotificationsLoggedOutModal } from 'features/subscription/NotificationsLoggedOutModal'
import { analytics } from 'libs/analytics'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

jest.mock('features/profile/pages/NotificationSettings/usePushPermission', () => ({
  usePushPermission: jest.fn(() => ({
    pushPermission: 'granted',
  })),
}))

const mockDismissModal = jest.fn()

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

describe('<NotificationsLoggedOutModal />', () => {
  it('should render correctly', () => {
    renderModal(true)

    expect(screen).toMatchSnapshot()
  })

  it('should dismiss modal on press rightIconButton', () => {
    renderModal(true)

    const dismissModalButton = screen.getByTestId('rightIcon')

    fireEvent.press(dismissModalButton)

    expect(mockDismissModal).toHaveBeenCalledTimes(1)
  })

  it('should dismiss modal on press "Créer un compte"', () => {
    renderModal(true)

    const authButton = screen.getByText('Créer un compte')

    fireEvent.press(authButton)

    expect(mockDismissModal).toHaveBeenCalledTimes(1)
  })

  it('should go to sign up page on press "Créer un compte"', async () => {
    renderModal(true)

    const authButton = screen.getByText('Créer un compte')

    fireEvent.press(authButton)

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('SignupForm', { from: 'thematicHome' })
    })
  })

  it('should dismiss modal on press "Se connecter"', () => {
    renderModal(true)

    const authButton = screen.getByText('Se connecter')

    fireEvent.press(authButton)

    expect(mockDismissModal).toHaveBeenCalledTimes(1)
  })

  it('should go to login page on press "Se connecter"', async () => {
    renderModal(true)

    const authButton = screen.getByText('Se connecter')

    fireEvent.press(authButton)

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('Login', { from: 'thematicHome' })
    })
  })

  it('should log analytics when clicking on "Créer un compte" button', async () => {
    renderModal(true)

    const authButton = screen.getByText('Créer un compte')
    fireEvent.press(authButton)

    expect(analytics.logSignUpClicked).toHaveBeenNthCalledWith(1, { from: 'ThematicHome' })
  })

  it('should log analytics when clicking on "Se connecter" button', async () => {
    renderModal(true)

    const authButton = screen.getByText('Se connecter')
    fireEvent.press(authButton)

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
