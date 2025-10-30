import React from 'react'
import { Linking } from 'react-native'

import * as API from 'api/api'
import * as usePushPermission from 'features/profile/pages/NotificationSettings/usePushPermission'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { SubscriptionTheme } from 'features/subscription/types'
import { beneficiaryUser } from 'fixtures/user'
import { analytics } from 'libs/analytics/provider'
import { mockAuthContextWithoutUser, mockAuthContextWithUser } from 'tests/AuthContextUtils'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'
import { SNACK_BAR_TIME_OUT } from 'ui/components/snackBar/SnackBarContext'

import { NotificationsSettings } from './NotificationsSettings'

jest.mock('libs/firebase/analytics/analytics')

jest.mock('libs/jwt/jwt')
jest.mock('features/auth/context/AuthContext')
const userWithoutNotificationsOn = {
  ...beneficiaryUser,
  subscriptions: {
    marketingEmail: false,
    marketingPush: false,
    subscribedThemes: [],
  },
}
mockAuthContextWithUser(userWithoutNotificationsOn, { persist: true })

const patchProfileSpy = jest.spyOn(API.api, 'patchNativeV1Profile')

const mockShowSuccessSnackBar = jest.fn()
const mockShowErrorSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showSuccessSnackBar: mockShowSuccessSnackBar,
    showErrorSnackBar: mockShowErrorSnackBar,
  }),
}))

const usePushPermissionSpy = jest.spyOn(usePushPermission, 'usePushPermission').mockReturnValue({
  pushPermission: 'granted',
  refreshPermission: jest.fn(),
})

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const EMAIL_SWITCH = /Autoriser l’envoi d’e-mails - Interrupteur à bascule/
const CINEMA_SWITCH = /Cinéma - Interrupteur à bascule/
const READING_SWITCH = /Lecture - Interrupteur à bascule/

const MUSIC_SWTICH = /Musique - Interrupteur à bascule/
const SHOW_SWITCH = /Spectacles - Interrupteur à bascule/
const VISIT_SWITCH = /Visites et sorties - Interrupteur à bascule/
const CREATIVE_ACTIVITIES_SWITCH = /Activités créatives - Interrupteur à bascule/
const NOTIFICATIONS_SWITCH = /Autoriser les notifications - Interrupteur à bascule/

const ALL_THEMES_SWITCH = /Suivre tous les thèmes - Interrupteur à bascule/

const user = userEvent.setup()

jest.useFakeTimers()

describe('NotificationsSettings', () => {
  it('should render correctly when user is logged in', () => {
    render(reactQueryProviderHOC(<NotificationsSettings />))

    expect(screen).toMatchSnapshot()
  })

  it('should render correctly when user is not logged in', () => {
    mockAuthContextWithoutUser()
    render(reactQueryProviderHOC(<NotificationsSettings />))

    expect(screen).toMatchSnapshot()
  })

  it('should disabled save button when user is not logged in', () => {
    mockAuthContextWithoutUser()
    render(reactQueryProviderHOC(<NotificationsSettings />))

    expect(screen.getByText('Enregistrer')).toBeDisabled()
  })

  it('should disabled save button when user hasn‘t changed any parameters', () => {
    render(reactQueryProviderHOC(<NotificationsSettings />))

    expect(screen.getByText('Enregistrer')).toBeDisabled()
  })

  it('should enable save button when user has changed a parameter', async () => {
    render(reactQueryProviderHOC(<NotificationsSettings />))

    const toggleSwitch = screen.getByTestId(EMAIL_SWITCH)
    await user.press(toggleSwitch)
    const cinemaSwitch = screen.getByTestId(CINEMA_SWITCH)
    await user.press(cinemaSwitch)

    expect(screen.getByText('Enregistrer')).toBeEnabled()
  })

  it('should get user default parameters', () => {
    mockAuthContextWithUser({
      ...beneficiaryUser,
      subscriptions: {
        marketingEmail: true,
        marketingPush: true,
        subscribedThemes: [SubscriptionTheme.MUSIQUE],
      },
    })
    render(reactQueryProviderHOC(<NotificationsSettings />))

    expect(screen.getByTestId(EMAIL_SWITCH)).toHaveAccessibilityState({ checked: true })
    expect(screen.getByTestId(NOTIFICATIONS_SWITCH)).toHaveAccessibilityState({ checked: true })
    expect(screen.getByTestId(MUSIC_SWTICH)).toHaveAccessibilityState({ checked: true })
  })

  it('should switch on all thematic toggles when the "Suivre tous les thèmes" toggle is pressed', async () => {
    render(reactQueryProviderHOC(<NotificationsSettings />))

    const toggleEmail = screen.getByTestId(EMAIL_SWITCH)
    await user.press(toggleEmail)

    const toggleSwitch = screen.getByTestId(ALL_THEMES_SWITCH)
    await user.press(toggleSwitch)

    expect(screen.getByTestId(CINEMA_SWITCH)).toHaveAccessibilityState({ checked: true })
    expect(screen.getByTestId(READING_SWITCH)).toHaveAccessibilityState({ checked: true })
    expect(screen.getByTestId(MUSIC_SWTICH)).toHaveAccessibilityState({ checked: true })
    expect(screen.getByTestId(SHOW_SWITCH)).toHaveAccessibilityState({ checked: true })
    expect(screen.getByTestId(VISIT_SWITCH)).toHaveAccessibilityState({ checked: true })
    expect(screen.getByTestId(CREATIVE_ACTIVITIES_SWITCH)).toHaveAccessibilityState({
      checked: true,
    })
  })

  it('should switch off all thematic toggles when the "Suivre tous les thèmes" toggle is pressed when active', async () => {
    render(reactQueryProviderHOC(<NotificationsSettings />))

    const toggleEmail = screen.getByTestId(EMAIL_SWITCH)
    await user.press(toggleEmail)

    const toggleSwitch = screen.getByTestId(ALL_THEMES_SWITCH)
    await user.press(toggleSwitch)
    await user.press(toggleSwitch)

    expect(screen.getByTestId(CINEMA_SWITCH)).toHaveAccessibilityState({ checked: false })
    expect(screen.getByTestId(READING_SWITCH)).toHaveAccessibilityState({ checked: false })
    expect(screen.getByTestId(MUSIC_SWTICH)).toHaveAccessibilityState({ checked: false })
    expect(screen.getByTestId(SHOW_SWITCH)).toHaveAccessibilityState({ checked: false })
    expect(screen.getByTestId(VISIT_SWITCH)).toHaveAccessibilityState({ checked: false })
    expect(screen.getByTestId(CREATIVE_ACTIVITIES_SWITCH)).toHaveAccessibilityState({
      checked: false,
    })
  })

  it('should toggle on specific theme when its toggle is pressed', async () => {
    render(reactQueryProviderHOC(<NotificationsSettings />))

    const toggleEmail = screen.getByTestId(EMAIL_SWITCH)
    await user.press(toggleEmail)

    const toggleSwitch = screen.getByTestId(CINEMA_SWITCH)
    await user.press(toggleSwitch)

    expect(screen.getByTestId(CINEMA_SWITCH)).toHaveAccessibilityState({ checked: true })
  })

  it('should disabled all thematic toggles when email toggle and push toggle are inactive', () => {
    render(reactQueryProviderHOC(<NotificationsSettings />))

    expect(screen.getByTestId(CINEMA_SWITCH)).toBeDisabled()
    expect(screen.getByTestId(READING_SWITCH)).toBeDisabled()
    expect(screen.getByTestId(MUSIC_SWTICH)).toBeDisabled()
    expect(screen.getByTestId(SHOW_SWITCH)).toBeDisabled()
    expect(screen.getByTestId(VISIT_SWITCH)).toBeDisabled()
    expect(screen.getByTestId(CREATIVE_ACTIVITIES_SWITCH)).toBeDisabled()
  })

  it('should switch off thematic toggle when disabling email and push toggle at the same time', async () => {
    render(reactQueryProviderHOC(<NotificationsSettings />))

    const toggleEmail = screen.getByTestId(EMAIL_SWITCH)
    await user.press(toggleEmail)
    const toggleSwitch = screen.getByTestId(CINEMA_SWITCH)
    await user.press(toggleSwitch)
    await user.press(toggleEmail)

    expect(screen.getByTestId(CINEMA_SWITCH)).toHaveAccessibilityState({ checked: false })
  })

  it('should display help message when the email toggle is inactive and user is logged in', () => {
    render(reactQueryProviderHOC(<NotificationsSettings />))

    expect(
      screen.getByText(
        'Tu continueras à recevoir par e-mail des informations essentielles concernant ton compte.'
      )
    ).toBeOnTheScreen()
  })

  it('should display info banner when email and push toggles are inactive', () => {
    render(reactQueryProviderHOC(<NotificationsSettings />))

    expect(
      screen.getByText(
        'Pour suivre un thème, tu dois accepter l’envoi d’e-mails ou de notifications.'
      )
    ).toBeOnTheScreen()
  })

  it('should not display info banner when at least email or push toggles is active', async () => {
    render(reactQueryProviderHOC(<NotificationsSettings />))

    const toggleEmail = screen.getByTestId(EMAIL_SWITCH)
    await user.press(toggleEmail)

    expect(
      screen.queryByText(
        'Pour suivre un thème, tu dois accepter l’envoi d’e-mails ou de notifications.'
      )
    ).not.toBeOnTheScreen()
  })

  it('should not display info banner when user is not logged in', () => {
    mockAuthContextWithoutUser()
    render(reactQueryProviderHOC(<NotificationsSettings />))

    expect(
      screen.queryByText(
        'Pour suivre un thème, tu dois accepter l’envoi d’e-mails ou de notifications.'
      )
    ).not.toBeOnTheScreen()
  })

  describe('When the user saves the changes', () => {
    it('should update profile', async () => {
      mockServer.patchApi<UserProfileResponseWithoutSurvey>('/v1/profile', {
        ...beneficiaryUser,
        subscriptions: { marketingEmail: true, marketingPush: false },
      })

      render(reactQueryProviderHOC(<NotificationsSettings />))

      const toggleEmail = screen.getByTestId(EMAIL_SWITCH)
      await user.press(toggleEmail)

      const saveButton = screen.getByText('Enregistrer')
      await user.press(saveButton)

      expect(patchProfileSpy).toHaveBeenCalledWith({
        subscriptions: {
          marketingEmail: true,
          marketingPush: false,
          subscribedThemes: [],
        },
        origin: 'ProfileNotificationsSettings',
      })
    })

    it('should show snackbar on success', async () => {
      mockServer.patchApi<UserProfileResponseWithoutSurvey>('/v1/profile', beneficiaryUser)

      render(reactQueryProviderHOC(<NotificationsSettings />))

      const toggleEmail = screen.getByTestId(EMAIL_SWITCH)
      await user.press(toggleEmail)

      const saveButton = screen.getByText('Enregistrer')
      await user.press(saveButton)

      expect(mockShowSuccessSnackBar).toHaveBeenCalledWith({
        message: 'Tes modifications ont été enregistrées\u00a0!',
        timeout: SNACK_BAR_TIME_OUT,
      })
    })

    it('should show snackbar on error', async () => {
      mockServer.patchApi('/v1/profile', {
        responseOptions: { statusCode: 400, data: {} },
      })

      render(reactQueryProviderHOC(<NotificationsSettings />))

      const toggleEmail = screen.getByTestId(EMAIL_SWITCH)
      await user.press(toggleEmail)

      const saveButton = screen.getByText('Enregistrer')
      await user.press(saveButton)

      expect(mockShowErrorSnackBar).toHaveBeenCalledWith({
        message: 'Une erreur est survenue',
        timeout: SNACK_BAR_TIME_OUT,
      })
    })

    it('should reset settings on error', async () => {
      mockServer.patchApi('/v1/profile', {
        responseOptions: { statusCode: 400, data: {} },
      })

      render(reactQueryProviderHOC(<NotificationsSettings />))

      const toggleEmail = screen.getByTestId(EMAIL_SWITCH)
      await user.press(toggleEmail)

      const saveButton = screen.getByText('Enregistrer')
      await user.press(saveButton)

      expect(toggleEmail).toHaveAccessibilityState({ checked: false })
    })
  })

  describe('The behavior of the push switch', () => {
    it('should open the push notification modal when the push toggle is pressed and the permission is not granted', async () => {
      usePushPermissionSpy.mockReturnValueOnce({
        pushPermission: 'blocked',
        refreshPermission: jest.fn(),
      })
      render(reactQueryProviderHOC(<NotificationsSettings />))

      const toggleSwitch = screen.getByTestId(NOTIFICATIONS_SWITCH)
      await user.press(toggleSwitch)

      expect(screen.getByText('Paramètres de notifications')).toBeOnTheScreen()
    })

    it('should open the settings from the push notifications modal', async () => {
      usePushPermissionSpy.mockReturnValueOnce({
        pushPermission: 'blocked',
        refreshPermission: jest.fn(),
      })
      render(reactQueryProviderHOC(<NotificationsSettings />))

      const toggleSwitch = screen.getByTestId(NOTIFICATIONS_SWITCH)
      await user.press(toggleSwitch)

      const openSettingsButton = await screen.findByLabelText('Autoriser les notifications')
      await user.press(openSettingsButton)

      expect(Linking.openSettings).toHaveBeenCalledTimes(1)
    })

    it('should toggle push switch when permission is granted and user press it', async () => {
      usePushPermissionSpy.mockReturnValueOnce({
        pushPermission: 'granted',
        refreshPermission: jest.fn(),
      })
      render(reactQueryProviderHOC(<NotificationsSettings />))

      const toggleSwitch = screen.getByTestId(NOTIFICATIONS_SWITCH)
      await user.press(toggleSwitch)

      expect(toggleSwitch).toHaveAccessibilityState({ checked: true })
    })
  })

  describe('When user has unsaved changes and attempts to go back', () => {
    it('should display a modal', async () => {
      render(reactQueryProviderHOC(<NotificationsSettings />))

      const toggleEmail = screen.getByTestId(EMAIL_SWITCH)
      await user.press(toggleEmail)

      const goBackButton = screen.getByTestId('Revenir en arrière')
      await user.press(goBackButton)

      expect(screen.getByText('Quitter sans enregistrer')).toBeOnTheScreen()
    })
  })

  describe('Analytics', () => {
    it('should log subscription update when user changes their subscription', async () => {
      mockServer.patchApi('/v1/profile', {})
      render(reactQueryProviderHOC(<NotificationsSettings />))

      const toggleEmail = screen.getByTestId(EMAIL_SWITCH)
      await user.press(toggleEmail)

      const toggleSwitch = screen.getByTestId(CINEMA_SWITCH)
      await user.press(toggleSwitch)

      const saveButton = screen.getByText('Enregistrer')

      await user.press(saveButton)

      expect(analytics.logSubscriptionUpdate).toHaveBeenCalledWith({
        type: 'update',
        from: 'profile',
      })
    })

    it('should log notification toggle update when user changes their settings', async () => {
      mockServer.patchApi('/v1/profile', {})
      render(reactQueryProviderHOC(<NotificationsSettings />))

      const toggleEmail = screen.getByTestId(EMAIL_SWITCH)
      await user.press(toggleEmail)

      const saveButton = screen.getByText('Enregistrer')
      await user.press(saveButton)

      expect(analytics.logNotificationToggle).toHaveBeenCalledWith(true, false)
    })

    it('should log notification toggle update when user changes their settings from save modal', async () => {
      mockServer.patchApi('/v1/profile', {})
      render(reactQueryProviderHOC(<NotificationsSettings />))

      const toggleEmail = screen.getByTestId(EMAIL_SWITCH)
      await user.press(toggleEmail)

      const goBackButton = screen.getByTestId('Revenir en arrière')
      await user.press(goBackButton)

      const saveButton = screen.getByText('Enregistrer mes modifications')
      await user.press(saveButton)

      expect(analytics.logNotificationToggle).toHaveBeenCalledWith(true, false)
    })

    it('should not log subscription update when user only changes their notifications settings', async () => {
      mockServer.patchApi<UserProfileResponseWithoutSurvey>('/v1/profile', {})
      render(reactQueryProviderHOC(<NotificationsSettings />))

      const toggleEmail = screen.getByTestId(EMAIL_SWITCH)
      await user.press(toggleEmail)

      const saveButton = screen.getByText('Enregistrer')
      await user.press(saveButton)

      expect(analytics.logSubscriptionUpdate).not.toHaveBeenCalled()
    })
  })
})
