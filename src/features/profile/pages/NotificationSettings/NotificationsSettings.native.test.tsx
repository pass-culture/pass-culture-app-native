import React from 'react'
import { Linking } from 'react-native'

import * as API from 'api/api'
import { UserProfileResponse } from 'api/gen'
import { IAuthContext, useAuthContext } from 'features/auth/context/AuthContext'
import * as usePushPermission from 'features/profile/pages/NotificationSettings/usePushPermission'
import { SubscriptionTheme } from 'features/subscription/types'
import { beneficiaryUser } from 'fixtures/user'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen, waitFor } from 'tests/utils'

import { NotificationsSettings } from './NotificationsSettings'

jest.mock('features/auth/context/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>

const postProfileSpy = jest.spyOn(API.api, 'postNativeV1Profile')

const mockShowSuccessSnackBar = jest.fn()
const mockShowErrorSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showSuccessSnackBar: mockShowSuccessSnackBar,
    showErrorSnackBar: mockShowErrorSnackBar,
  }),
}))

const baseAuthContext: IAuthContext = {
  isLoggedIn: true,
  user: {
    ...beneficiaryUser,
    subscriptions: {
      marketingEmail: false,
      marketingPush: false,
    },
  },
  isUserLoading: false,
  refetchUser: jest.fn(),
  setIsLoggedIn: jest.fn(),
}

mockUseAuthContext.mockReturnValue(baseAuthContext)

const usePushPermissionSpy = jest.spyOn(usePushPermission, 'usePushPermission').mockReturnValue({
  pushPermission: 'granted',
  refreshPermission: jest.fn(),
})

describe('NotificationSettings', () => {
  it('should render correctly when user is logged in', () => {
    mockUseAuthContext.mockReturnValueOnce(baseAuthContext)
    render(reactQueryProviderHOC(<NotificationsSettings />))

    expect(screen).toMatchSnapshot()
  })

  it('should render correctly when user is not logged in', () => {
    mockUseAuthContext.mockReturnValueOnce({
      ...baseAuthContext,
      user: undefined,
      isLoggedIn: false,
    })
    render(reactQueryProviderHOC(<NotificationsSettings />))

    expect(screen).toMatchSnapshot()
  })

  it('should disabled save button when user is not logged in', () => {
    mockUseAuthContext.mockReturnValueOnce({
      ...baseAuthContext,
      user: undefined,
      isLoggedIn: false,
    })
    render(reactQueryProviderHOC(<NotificationsSettings />))

    expect(screen.getByText('Enregistrer')).toBeDisabled()
  })

  it('should disabled save button when user hasn‘t changed any parameters', () => {
    mockUseAuthContext.mockReturnValueOnce({
      ...baseAuthContext,
      user: beneficiaryUser,
      isLoggedIn: false,
    })

    render(reactQueryProviderHOC(<NotificationsSettings />))

    expect(screen.getByText('Enregistrer')).toBeDisabled()
  })

  it('should enable save button when user has changed a parameter', () => {
    mockUseAuthContext.mockReturnValueOnce(baseAuthContext)

    render(reactQueryProviderHOC(<NotificationsSettings />))

    const toggleSwitch = screen.getByTestId('Interrupteur Cinéma')
    fireEvent.press(toggleSwitch)

    expect(screen.getByText('Enregistrer')).toBeEnabled()
  })

  it('should get user default parameters', () => {
    mockUseAuthContext.mockReturnValueOnce({
      ...baseAuthContext,
      user: {
        ...beneficiaryUser,
        subscriptions: {
          marketingEmail: true,
          marketingPush: true,
          subscribedThemes: [SubscriptionTheme.MUSIQUE],
        },
      },
      isLoggedIn: true,
    })
    render(reactQueryProviderHOC(<NotificationsSettings />))

    expect(screen.getByTestId('Interrupteur Autoriser l’envoi d’e-mails')).toHaveAccessibilityState(
      {
        checked: true,
      }
    )
    expect(screen.getByTestId('Interrupteur Autoriser les notifications')).toHaveAccessibilityState(
      {
        checked: true,
      }
    )

    expect(screen.getByTestId('Interrupteur Musique')).toHaveAccessibilityState({ checked: true })
  })

  it('should switch on all thematic toggles when the "Suivre tous les thèmes" toggle is pressed', async () => {
    mockUseAuthContext.mockReturnValueOnce(baseAuthContext)
    render(reactQueryProviderHOC(<NotificationsSettings />))

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
    expect(screen.getByTestId('Interrupteur Activités créatives')).toHaveAccessibilityState({
      checked: true,
    })
  })

  it('should switch off all thematic toggles when the "Suivre tous les thèmes" toggle is pressed when active', async () => {
    mockUseAuthContext.mockReturnValueOnce(baseAuthContext)
    render(reactQueryProviderHOC(<NotificationsSettings />))

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
    expect(screen.getByTestId('Interrupteur Activités créatives')).toHaveAccessibilityState({
      checked: false,
    })
  })

  it('should toggle on specific theme when its toggle is pressed', async () => {
    mockUseAuthContext.mockReturnValueOnce(baseAuthContext)
    render(reactQueryProviderHOC(<NotificationsSettings />))

    const toggleEmail = screen.getByTestId('Interrupteur Autoriser l’envoi d’e-mails')
    fireEvent.press(toggleEmail)

    const toggleSwitch = screen.getByTestId('Interrupteur Cinéma')
    fireEvent.press(toggleSwitch)

    expect(screen.getByTestId('Interrupteur Cinéma')).toHaveAccessibilityState({ checked: true })
  })

  it('should disabled all thematic toggles when email toggle and push toggle are inactive', () => {
    mockUseAuthContext.mockReturnValueOnce(baseAuthContext)
    render(reactQueryProviderHOC(<NotificationsSettings />))

    expect(screen.getByTestId('Interrupteur Cinéma')).toBeDisabled()
    expect(screen.getByTestId('Interrupteur Lecture')).toBeDisabled()
    expect(screen.getByTestId('Interrupteur Musique')).toBeDisabled()
    expect(screen.getByTestId('Interrupteur Spectacles')).toBeDisabled()
    expect(screen.getByTestId('Interrupteur Visites et sorties')).toBeDisabled()
    expect(screen.getByTestId('Interrupteur Activités créatives')).toBeDisabled()
  })

  it('should switch off thematic toggle when disabling email and push toggle at the same time', () => {
    mockUseAuthContext.mockReturnValueOnce(baseAuthContext)
    render(reactQueryProviderHOC(<NotificationsSettings />))

    const toggleEmail = screen.getByTestId('Interrupteur Autoriser l’envoi d’e-mails')
    fireEvent.press(toggleEmail)
    const toggleSwitch = screen.getByTestId('Interrupteur Cinéma')
    fireEvent.press(toggleSwitch)
    fireEvent.press(toggleEmail)

    expect(screen.getByTestId('Interrupteur Cinéma')).toHaveAccessibilityState({ checked: false })
  })

  it('should display help message when the email toggle is inactive and user is logged in', () => {
    mockUseAuthContext.mockReturnValueOnce(baseAuthContext)
    render(reactQueryProviderHOC(<NotificationsSettings />))

    expect(
      screen.getByText(
        'Tu continueras à recevoir par e-mail des informations essentielles concernant ton compte.'
      )
    ).toBeOnTheScreen()
  })

  it('should display info banner when email and push toggles are inactive', () => {
    mockUseAuthContext.mockReturnValueOnce(baseAuthContext)
    render(reactQueryProviderHOC(<NotificationsSettings />))

    expect(
      screen.getByText(
        'Pour suivre un thème, tu dois accepter l’envoi d’e-mails ou de notifications.'
      )
    ).toBeOnTheScreen()
  })

  it('should not display info banner when at least email or push toggles is active', () => {
    mockUseAuthContext.mockReturnValueOnce(baseAuthContext)
    render(reactQueryProviderHOC(<NotificationsSettings />))

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
    render(reactQueryProviderHOC(<NotificationsSettings />))

    expect(
      screen.queryByText(
        'Pour suivre un thème, tu dois accepter l’envoi d’e-mails ou de notifications.'
      )
    ).not.toBeOnTheScreen()
  })

  describe('When the user saves the changes', () => {
    it('should update profile', async () => {
      mockUseAuthContext.mockReturnValueOnce(baseAuthContext)
      mockServer.postApi<UserProfileResponse>('/v1/profile', {
        ...beneficiaryUser,
        subscriptions: { marketingEmail: true, marketingPush: false },
      })

      render(reactQueryProviderHOC(<NotificationsSettings />))

      const toggleEmail = screen.getByTestId('Interrupteur Autoriser l’envoi d’e-mails')
      await act(async () => fireEvent.press(toggleEmail))

      const saveButton = screen.getByText('Enregistrer')
      await act(async () => fireEvent.press(saveButton))

      await waitFor(() => {
        expect(postProfileSpy).toHaveBeenCalledWith({
          subscriptions: {
            marketingEmail: true,
            marketingPush: false,
            subscribedThemes: [],
          },
        })
      })
    })

    it('should show snackbar on success', async () => {
      mockUseAuthContext.mockReturnValueOnce(baseAuthContext)
      mockServer.postApi<UserProfileResponse>('/v1/profile', beneficiaryUser)

      render(reactQueryProviderHOC(<NotificationsSettings />))

      const toggleEmail = screen.getByTestId('Interrupteur Autoriser l’envoi d’e-mails')
      fireEvent.press(toggleEmail)

      const saveButton = screen.getByText('Enregistrer')
      await act(async () => fireEvent.press(saveButton))

      expect(mockShowSuccessSnackBar).toHaveBeenCalledWith({
        message: 'Tes modifications ont été enregistrées\u00a0!',
      })
    })

    it('should show snackbar on error', async () => {
      mockUseAuthContext.mockReturnValueOnce(baseAuthContext)
      mockServer.postApi('/v1/profile', {
        responseOptions: { statusCode: 400, data: {} },
      })

      render(reactQueryProviderHOC(<NotificationsSettings />))

      const toggleEmail = screen.getByTestId('Interrupteur Autoriser l’envoi d’e-mails')
      fireEvent.press(toggleEmail)

      const saveButton = screen.getByText('Enregistrer')
      await act(async () => fireEvent.press(saveButton))

      expect(mockShowErrorSnackBar).toHaveBeenCalledWith({ message: 'Une erreur est survenue' })
    })

    it('should reset settings on error', async () => {
      mockUseAuthContext.mockReturnValueOnce(baseAuthContext)
      mockServer.postApi('/v1/profile', {
        responseOptions: { statusCode: 400, data: {} },
      })

      render(reactQueryProviderHOC(<NotificationsSettings />))

      const toggleEmail = screen.getByTestId('Interrupteur Autoriser l’envoi d’e-mails')
      fireEvent.press(toggleEmail)

      const saveButton = screen.getByText('Enregistrer')
      await act(async () => fireEvent.press(saveButton))

      expect(toggleEmail).toHaveAccessibilityState({ checked: false })
    })
  })

  describe('The behavior of the push switch', () => {
    it('should open the push notification modal when the push toggle is pressed and the permission is not granted', () => {
      mockUseAuthContext.mockReturnValueOnce(baseAuthContext)
      usePushPermissionSpy.mockReturnValueOnce({
        pushPermission: 'blocked',
        refreshPermission: jest.fn(),
      })
      render(reactQueryProviderHOC(<NotificationsSettings />))

      const toggleSwitch = screen.getByTestId('Interrupteur Autoriser les notifications')
      fireEvent.press(toggleSwitch)

      expect(screen.getByText('Paramètres de notifications')).toBeOnTheScreen()
    })

    it('should open the settings from the push notifications modal', async () => {
      mockUseAuthContext.mockReturnValueOnce(baseAuthContext)
      usePushPermissionSpy.mockReturnValueOnce({
        pushPermission: 'blocked',
        refreshPermission: jest.fn(),
      })
      render(reactQueryProviderHOC(<NotificationsSettings />))

      const toggleSwitch = screen.getByTestId('Interrupteur Autoriser les notifications')
      fireEvent.press(toggleSwitch)

      const openSettingsButton = await screen.findByLabelText('Autoriser les notifications')
      fireEvent.press(openSettingsButton)

      expect(Linking.openSettings).toHaveBeenCalledTimes(1)
    })

    it('should toggle push switch when permission is granted and user press it', async () => {
      mockUseAuthContext.mockReturnValueOnce(baseAuthContext)
      usePushPermissionSpy.mockReturnValueOnce({
        pushPermission: 'granted',
        refreshPermission: jest.fn(),
      })
      render(reactQueryProviderHOC(<NotificationsSettings />))

      const toggleSwitch = screen.getByTestId('Interrupteur Autoriser les notifications')
      fireEvent.press(toggleSwitch)

      expect(toggleSwitch).toHaveAccessibilityState({ checked: true })
    })
  })
})
