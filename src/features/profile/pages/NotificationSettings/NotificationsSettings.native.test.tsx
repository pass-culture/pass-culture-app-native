import React from 'react'
import { Linking } from 'react-native'

import { IAuthContext, useAuthContext } from 'features/auth/context/AuthContext'
import * as usePushPermission from 'features/profile/pages/NotificationSettings/usePushPermission'
import { beneficiaryUser } from 'fixtures/user'
import { fireEvent, render, screen } from 'tests/utils'

import { NotificationsSettings } from './NotificationsSettings'

jest.mock('features/auth/context/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>

const baseAuthContext: IAuthContext = {
  isLoggedIn: true,
  user: beneficiaryUser,
  isUserLoading: false,
  refetchUser: jest.fn(),
  setIsLoggedIn: jest.fn(),
}

const usePushPermissionSpy = jest.spyOn(usePushPermission, 'usePushPermission').mockReturnValue({
  pushPermission: 'granted',
  refreshPermission: jest.fn(),
})

describe('NotificationSettings', () => {
  it('should render correctly when user is logged in', () => {
    mockUseAuthContext.mockReturnValueOnce(baseAuthContext)
    render(<NotificationsSettings />)

    expect(screen).toMatchSnapshot()
  })

  it('should render correctly when user is not logged in', () => {
    mockUseAuthContext.mockReturnValueOnce({
      ...baseAuthContext,
      user: undefined,
      isLoggedIn: false,
    })
    render(<NotificationsSettings />)

    expect(screen).toMatchSnapshot()
  })

  it('should disabled save button when user is not logged in', () => {
    mockUseAuthContext.mockReturnValueOnce({
      ...baseAuthContext,
      user: undefined,
      isLoggedIn: false,
    })
    render(<NotificationsSettings />)

    expect(screen.getByText('Enregistrer')).toBeDisabled()
  })

  it('should switch on all thematic toggles when the "Suivre tous les thèmes" toggle is pressed', async () => {
    mockUseAuthContext.mockReturnValueOnce(baseAuthContext)
    render(<NotificationsSettings />)

    const toggleEmail = screen.getByTestId('Interrupteur Autoriser l’envoi d’e-mails')
    fireEvent.press(toggleEmail)

    const toggleSwitch = screen.getByTestId('Interrupteur Suivre tous les thèmes')
    fireEvent.press(toggleSwitch)

    expect(screen.getByTestId('Interrupteur Cinéma')).toHaveAccessibilityState({ checked: true })
    expect(screen.getByTestId('Interrupteur Lecture')).toHaveAccessibilityState({ checked: true })
    expect(screen.getByTestId('Interrupteur Musique')).toHaveAccessibilityState({ checked: true })
    expect(screen.getByTestId('Interrupteur Spectacles')).toHaveAccessibilityState({
      checked: true,
    })
    expect(screen.getByTestId('Interrupteur Visites et sorties')).toHaveAccessibilityState({
      checked: true,
    })
    expect(screen.getByTestId('Interrupteur Cours et Ateliers')).toHaveAccessibilityState({
      checked: true,
    })
  })

  it('should switch off all thematic toggles when the "Suivre tous les thèmes" toggle is pressed when active', async () => {
    mockUseAuthContext.mockReturnValueOnce(baseAuthContext)
    render(<NotificationsSettings />)

    const toggleEmail = screen.getByTestId('Interrupteur Autoriser l’envoi d’e-mails')
    fireEvent.press(toggleEmail)

    const toggleSwitch = screen.getByTestId('Interrupteur Suivre tous les thèmes')
    fireEvent.press(toggleSwitch)
    fireEvent.press(toggleSwitch)

    expect(screen.getByTestId('Interrupteur Cinéma')).toHaveAccessibilityState({ checked: false })
    expect(screen.getByTestId('Interrupteur Lecture')).toHaveAccessibilityState({ checked: false })
    expect(screen.getByTestId('Interrupteur Musique')).toHaveAccessibilityState({ checked: false })
    expect(screen.getByTestId('Interrupteur Spectacles')).toHaveAccessibilityState({
      checked: false,
    })
    expect(screen.getByTestId('Interrupteur Visites et sorties')).toHaveAccessibilityState({
      checked: false,
    })
    expect(screen.getByTestId('Interrupteur Cours et Ateliers')).toHaveAccessibilityState({
      checked: false,
    })
  })

  it('should toggle on specific theme when its toggle is pressed', async () => {
    mockUseAuthContext.mockReturnValueOnce(baseAuthContext)
    render(<NotificationsSettings />)

    const toggleEmail = screen.getByTestId('Interrupteur Autoriser l’envoi d’e-mails')
    fireEvent.press(toggleEmail)

    const toggleSwitch = screen.getByTestId('Interrupteur Cinéma')
    fireEvent.press(toggleSwitch)

    expect(screen.getByTestId('Interrupteur Cinéma')).toHaveAccessibilityState({ checked: true })
  })

  it('should disabled all thematic toggles when email toggle and push toggle are inactive', () => {
    mockUseAuthContext.mockReturnValueOnce(baseAuthContext)
    render(<NotificationsSettings />)

    expect(screen.getByTestId('Interrupteur Cinéma')).toBeDisabled()
    expect(screen.getByTestId('Interrupteur Lecture')).toBeDisabled()
    expect(screen.getByTestId('Interrupteur Musique')).toBeDisabled()
    expect(screen.getByTestId('Interrupteur Spectacles')).toBeDisabled()
    expect(screen.getByTestId('Interrupteur Visites et sorties')).toBeDisabled()
    expect(screen.getByTestId('Interrupteur Cours et Ateliers')).toBeDisabled()
  })

  it('should switch off thematic toggle when disabling email and push toggle at the same time', () => {
    mockUseAuthContext.mockReturnValueOnce(baseAuthContext)
    render(<NotificationsSettings />)

    const toggleEmail = screen.getByTestId('Interrupteur Autoriser l’envoi d’e-mails')
    fireEvent.press(toggleEmail)
    const toggleSwitch = screen.getByTestId('Interrupteur Cinéma')
    fireEvent.press(toggleSwitch)
    fireEvent.press(toggleEmail)

    expect(screen.getByTestId('Interrupteur Cinéma')).toHaveAccessibilityState({ checked: false })
  })

  it('should display help message when the email toggle is inactive and user is logged in', () => {
    mockUseAuthContext.mockReturnValueOnce(baseAuthContext)
    render(<NotificationsSettings />)

    expect(
      screen.getByText(
        'Tu continueras à recevoir par e-mail des informations essentielles concernant ton compte.'
      )
    ).toBeOnTheScreen()
  })

  it('should display info banner when email and push toggles are inactive', () => {
    mockUseAuthContext.mockReturnValueOnce(baseAuthContext)
    render(<NotificationsSettings />)

    expect(
      screen.queryByText(
        'Pour suivre un thème, tu dois accepter l’envoi d’e-mails ou de notifications.'
      )
    ).toBeOnTheScreen()
  })

  it('should not display info banner when at least email or push toggles is active', () => {
    mockUseAuthContext.mockReturnValueOnce(baseAuthContext)
    render(<NotificationsSettings />)

    const toggleEmail = screen.getByTestId('Interrupteur Autoriser l’envoi d’e-mails')
    fireEvent.press(toggleEmail)

    expect(
      screen.queryByText(
        'Pour suivre un thème, tu dois accepter l’envoi d’e-mails ou de notifications.'
      )
    ).not.toBeOnTheScreen()
  })

  it('should not display info banner when user is not logged in', () => {
    mockUseAuthContext.mockReturnValueOnce({
      ...baseAuthContext,
      isLoggedIn: false,
      user: undefined,
    })
    render(<NotificationsSettings />)

    expect(
      screen.queryByText(
        'Pour suivre un thème, tu dois accepter l’envoi d’e-mails ou de notifications.'
      )
    ).not.toBeOnTheScreen()
  })

  describe('The behavior of the push switch', () => {
    it('should open the push notification modal when the push toggle is pressed and the permission is not granted', () => {
      mockUseAuthContext.mockReturnValueOnce(baseAuthContext)
      usePushPermissionSpy.mockReturnValueOnce({
        pushPermission: 'blocked',
        refreshPermission: jest.fn(),
      })
      render(<NotificationsSettings />)

      const toggleSwitch = screen.getByTestId('Interrupteur Autoriser les notifications')
      fireEvent.press(toggleSwitch)

      expect(screen.queryByText('Paramètres de notifications')).toBeOnTheScreen()
    })

    it('should open the settings from the push notifications modal', async () => {
      mockUseAuthContext.mockReturnValueOnce(baseAuthContext)
      usePushPermissionSpy.mockReturnValueOnce({
        pushPermission: 'blocked',
        refreshPermission: jest.fn(),
      })
      render(<NotificationsSettings />)

      const toggleSwitch = screen.getByTestId('Interrupteur Autoriser les notifications')
      fireEvent.press(toggleSwitch)

      const openSettingsButton = await screen.findByLabelText('Autoriser les notifications')
      fireEvent.press(openSettingsButton)

      expect(Linking.openSettings).toHaveBeenCalledTimes(1)
    })
  })
})
