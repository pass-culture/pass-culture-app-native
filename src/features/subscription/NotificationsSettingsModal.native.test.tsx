import React from 'react'

import { NotificationsSettingsModal } from 'features/subscription/NotificationsSettingsModal'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen, act } from 'tests/utils'

jest.mock('features/profile/pages/NotificationSettings/usePushPermission', () => ({
  usePushPermission: jest.fn(() => ({
    pushPermission: 'granted',
  })),
}))

const mockDismissModal = jest.fn()
const mockOnPressSaveChanges = jest.fn()

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

describe('<NotificationsSettingsModal />', () => {
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

  it('should reset the switch when dismissing the modal', () => {
    renderModal(true)

    const toggleSwitch = screen.getByTestId('Interrupteur Autoriser l’envoi d’e-mails')
    fireEvent.press(toggleSwitch)

    const dismissModalButton = screen.getByTestId('rightIcon')
    fireEvent.press(dismissModalButton)

    expect(toggleSwitch).toHaveAccessibilityState({ checked: false })
  })

  it('should dismiss modal on press "Tout refuser..."', () => {
    renderModal(true)

    const declineButton = screen.getByText('Tout refuser et ne pas recevoir d’actus')

    fireEvent.press(declineButton)

    expect(mockDismissModal).toHaveBeenCalledTimes(1)
  })

  it('should reset the switch on press "Tout refuser..."', () => {
    renderModal(true)

    const toggleSwitch = screen.getByTestId('Interrupteur Autoriser l’envoi d’e-mails')
    fireEvent.press(toggleSwitch)

    const declineButton = screen.getByText('Tout refuser et ne pas recevoir d’actus')
    fireEvent.press(declineButton)

    expect(toggleSwitch).toHaveAccessibilityState({ checked: false })
  })

  it('should dismiss modal when saving changes', async () => {
    renderModal(true)

    const toggleSwitch = screen.getByTestId('Interrupteur Autoriser l’envoi d’e-mails')
    fireEvent.press(toggleSwitch)

    await act(async () => {
      fireEvent.press(screen.getByText('Valider'))
    })

    expect(mockDismissModal).toHaveBeenCalledTimes(1)
  })

  it('should call onPressSaveChanges when saving changes', async () => {
    renderModal(true)

    const toggleSwitch = screen.getByTestId('Interrupteur Autoriser l’envoi d’e-mails')
    fireEvent.press(toggleSwitch)

    await act(async () => {
      fireEvent.press(screen.getByText('Valider'))
    })

    expect(mockOnPressSaveChanges).toHaveBeenCalledWith({ allowEmails: true, allowPush: false })
  })

  it('should call onPressSaveChanges with allowEmails true when saving changes', async () => {
    renderModal(true)

    const toggleSwitch = screen.getByTestId('Interrupteur Autoriser l’envoi d’e-mails')
    fireEvent.press(toggleSwitch)

    await act(async () => {
      fireEvent.press(screen.getByText('Valider'))
    })

    expect(mockOnPressSaveChanges).toHaveBeenCalledWith({ allowEmails: true, allowPush: false })
  })

  it('should call onPressSaveChanges with allowPush true when saving changes', async () => {
    renderModal(true)

    const toggleSwitch = screen.getByTestId('Interrupteur Autoriser les notifications')
    fireEvent.press(toggleSwitch)

    await act(async () => {
      fireEvent.press(screen.getByText('Valider'))
    })

    expect(mockOnPressSaveChanges).toHaveBeenCalledWith({ allowEmails: false, allowPush: true })
  })

  it('should see "Cinéma" when theme is set accordingly', async () => {
    renderModal(true)

    expect(screen.getByText(/Cinéma/)).toBeTruthy()
  })

  it('button "Valider" should be disabled when no switch is toggled', async () => {
    renderModal(true)

    expect(screen.getByText('Valider')).toBeDisabled()
  })
})

const renderModal = (visible: boolean) => {
  render(
    reactQueryProviderHOC(
      <NotificationsSettingsModal
        visible={visible}
        dismissModal={mockDismissModal}
        title="S’abonner au thème “Cinéma”"
        description="Pour recevoir toute l’actu de ce thème, tu dois, au choix&nbsp;:"
        onPressSaveChanges={mockOnPressSaveChanges}
      />
    )
  )
}
