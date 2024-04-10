import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { NotificationsConnectionModal } from 'features/subscription/NotificationsConnectionModal'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

jest.mock('features/profile/pages/NotificationSettings/usePushPermission', () => ({
  usePushPermission: jest.fn(() => ({
    pushPermission: 'granted',
  })),
}))

const mockDismissModal = jest.fn()

describe('<NotificationsConnectionModal />', () => {
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

  it('should go to connection page on press "Créer un compte"', async () => {
    renderModal(true)

    const authButton = screen.getByText('Créer un compte')

    fireEvent.press(authButton)

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('SignupForm', { from: 'favorite' })
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
      expect(navigate).toHaveBeenCalledWith('Login', { from: 'favorite' })
    })
  })
})

const renderModal = (visible: boolean) => {
  render(
    reactQueryProviderHOC(
      <NotificationsConnectionModal visible={visible} dismissModal={mockDismissModal} />
    )
  )
}
