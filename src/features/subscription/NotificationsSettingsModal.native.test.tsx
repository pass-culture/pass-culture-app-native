import React from 'react'

import { NotificationsSettingsModal } from 'features/subscription/NotificationsSettingsModal'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('features/profile/pages/NotificationSettings/usePushPermission', () => ({
  usePushPermission: jest.fn(() => ({
    pushPermission: 'granted',
  })),
}))

const mockDismissModal = jest.fn()
const mockOnPressSaveChanges = jest.fn()

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const SENDING_EMAIL_SWITCH = /Autoriser l’envoi d’e-mails - Interrupteur à bascule/
const NOTIFICATIONS_SWITCH = /Autoriser les notifications - Interrupteur à bascule/

const user = userEvent.setup()
jest.useFakeTimers()

describe('<NotificationsSettingsModal />', () => {
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

  it('should reset the switch when dismissing the modal', async () => {
    renderModal(true)

    const toggleSwitch = screen.getByTestId(SENDING_EMAIL_SWITCH)
    await user.press(toggleSwitch)

    const dismissModalButton = screen.getByTestId('rightIcon')
    await user.press(dismissModalButton)

    expect(toggleSwitch).toHaveAccessibilityState({ checked: false })
  })

  it('should dismiss modal on press "Tout refuser..."', async () => {
    renderModal(true)

    const declineButton = screen.getByText('Tout refuser et ne pas recevoir d’actus')

    await user.press(declineButton)

    expect(mockDismissModal).toHaveBeenCalledTimes(1)
  })

  it('should reset the switch on press "Tout refuser..."', async () => {
    renderModal(true)

    const toggleSwitch = screen.getByTestId(SENDING_EMAIL_SWITCH)
    await user.press(toggleSwitch)

    const declineButton = screen.getByText('Tout refuser et ne pas recevoir d’actus')
    await user.press(declineButton)

    expect(toggleSwitch).toHaveAccessibilityState({ checked: false })
  })

  it('should dismiss modal when saving changes', async () => {
    renderModal(true)

    const toggleSwitch = screen.getByTestId(SENDING_EMAIL_SWITCH)
    await user.press(toggleSwitch)

    await user.press(screen.getByText('Valider'))

    expect(mockDismissModal).toHaveBeenCalledTimes(1)
  })

  it('should call onPressSaveChanges when saving changes', async () => {
    renderModal(true)

    const toggleSwitch = screen.getByTestId(SENDING_EMAIL_SWITCH)
    await user.press(toggleSwitch)

    await user.press(screen.getByText('Valider'))

    expect(mockOnPressSaveChanges).toHaveBeenCalledWith({ allowEmails: true, allowPush: false })
  })

  it('should call onPressSaveChanges with allowEmails true when saving changes', async () => {
    renderModal(true)

    const toggleSwitch = screen.getByTestId(SENDING_EMAIL_SWITCH)
    await user.press(toggleSwitch)

    await user.press(screen.getByText('Valider'))

    expect(mockOnPressSaveChanges).toHaveBeenCalledWith({ allowEmails: true, allowPush: false })
  })

  it('should call onPressSaveChanges with allowPush true when saving changes', async () => {
    renderModal(true)

    const toggleSwitch = screen.getByTestId(NOTIFICATIONS_SWITCH)
    await user.press(toggleSwitch)

    await user.press(screen.getByText('Valider'))

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
