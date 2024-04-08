import React from 'react'
import * as RNP from 'react-native-permissions'
import { NotificationsResponse, PermissionStatus } from 'react-native-permissions'
import { ReactTestInstance } from 'react-test-renderer'

import { useRoute } from '__mocks__/@react-navigation/native'
import { UserProfileResponse } from 'api/gen'
import * as Auth from 'features/auth/context/AuthContext'
import { mockGoBack } from 'features/navigation/__mocks__/useGoBack'
import { analytics } from 'libs/analytics'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen, act } from 'tests/utils'

import { NotificationSettingsDeprecated } from './NotificationSettingsDeprecated'

jest.mock('features/auth/context/AuthContext')
const mockUseAuthContext = Auth.useAuthContext as jest.Mock

useRoute.mockReturnValue({ key: 'ksdqldkmqdmqdq' })

describe('NotificationsSettings', () => {
  it('should display both switches', async () => {
    renderNotificationSettings('granted', {} as UserProfileResponse)

    expect(await screen.findByText('Autoriser l’envoi d’e-mails')).toBeOnTheScreen()
    expect(screen.getByText('Autoriser les notifications marketing')).toBeOnTheScreen()
  })

  it('Push switch should be enabled', async () => {
    renderNotificationSettings('granted', {
      subscriptions: {
        marketingEmail: false,
        marketingPush: true,
      },
    } as UserProfileResponse)

    await screen.findByText('Autoriser l’envoi d’e-mails')

    const pushSwitch = screen.getByTestId('Interrupteur Autoriser les notifications marketing')

    expect(pushSwitch.parent?.props.accessibilityState.checked).toBe(true)
  })

  it.each<[PermissionStatus, boolean]>([
    ['unavailable', true],
    ['blocked', true],
    ['denied', true],
    ['limited', true],
    ['granted', false],
  ])(
    'should display a disabled switch when permission="%s" and marketingPush="%s"',
    async (permission, marketingPush) => {
      renderNotificationSettings(permission, {
        subscriptions: {
          marketingEmail: false,
          marketingPush,
        },
      } as UserProfileResponse)

      await screen.findByText('Autoriser l’envoi d’e-mails')

      const pushSwitch = screen.getByTestId('Interrupteur Autoriser l’envoi d’e-mails')

      expect(pushSwitch.parent?.props.accessibilityState.checked).toBe(false)
    }
  )

  describe('The transitions of the push switch', () => {
    it('should enable the switch when permission=="granted" and push previously not allowed', async () => {
      renderNotificationSettings('granted', {
        subscriptions: {
          marketingEmail: true,
          marketingPush: false,
        },
      } as UserProfileResponse)

      await screen.findByText('Autoriser les notifications marketing')

      const toggleSwitch = screen.getByTestId('Interrupteur Autoriser les notifications marketing')
      fireEvent.press(toggleSwitch)

      expect(toggleSwitch.parent?.props.accessibilityState.checked).toBe(true)
      expect((toggleSwitch.children[0] as ReactTestInstance).props.active).toBe(true)
    })

    it('should disable the switch when permission=="granted" and push previously allowed', async () => {
      renderNotificationSettings('granted', {
        subscriptions: {
          marketingEmail: true,
          marketingPush: true,
        },
      } as UserProfileResponse)

      await screen.findByText('Autoriser les notifications marketing')

      const toggleSwitch = screen.getByTestId('Interrupteur Autoriser les notifications marketing')
      fireEvent.press(toggleSwitch)

      expect(toggleSwitch.parent?.props.accessibilityState.checked).toBe(false)
      expect((toggleSwitch.children[0] as ReactTestInstance).props.active).toBe(false)
    })

    it.each<PermissionStatus>(['unavailable', 'blocked', 'denied', 'limited'])(
      'should open the modal when permission!="granted" (==%s) and trying to allow',
      async (permission) => {
        renderNotificationSettings(permission, {
          subscriptions: {
            marketingEmail: true,
            marketingPush: false, // the user push setting doesn't care
          },
        } as UserProfileResponse)

        await screen.findByText('Autoriser les notifications marketing')

        const toggleSwitch = screen.getByTestId(
          'Interrupteur Autoriser les notifications marketing'
        )
        fireEvent.press(toggleSwitch)

        expect(screen.queryAllByTestId('modal-notifications-permission-modal')).not.toHaveLength(0)
      }
    )
  })

  describe('The behavior of the save button', () => {
    it('should not be displayed for unauthenticated users', async () => {
      renderNotificationSettings(
        'granted',
        {
          subscriptions: {},
        } as UserProfileResponse,
        false
      )
      await screen.findByText('Autoriser l’envoi d’e-mails')

      const saveButton = screen.queryByTestId('Enregistrer les modifications')

      expect(saveButton).not.toBeOnTheScreen()
    })

    it('should enable the save button when the email switch changed', async () => {
      mockApiUpdateProfile({
        subscriptions: {
          marketingEmail: false,
          marketingPush: true,
        },
      } as UserProfileResponse)
      renderNotificationSettings(
        'granted',
        {
          subscriptions: {
            marketingEmail: true,
            marketingPush: true,
          },
        } as UserProfileResponse,
        true
      )

      await screen.findByText('Autoriser l’envoi d’e-mails')

      const toggleSwitch = screen.getByTestId('Interrupteur Autoriser l’envoi d’e-mails')
      fireEvent.press(toggleSwitch)

      const saveButton = screen.getByTestId('Enregistrer les modifications')

      expect(saveButton).toBeEnabled()
    })

    it('should go back when notifications settings have sucessfully change', async () => {
      mockApiUpdateProfile({
        subscriptions: {
          marketingEmail: false,
          marketingPush: true,
        },
      } as UserProfileResponse)
      renderNotificationSettings(
        'granted',
        {
          subscriptions: {
            marketingEmail: true,
            marketingPush: true,
          },
        } as UserProfileResponse,
        true
      )

      await screen.findByText('Autoriser l’envoi d’e-mails')

      const toggleSwitch = screen.getByTestId('Interrupteur Autoriser l’envoi d’e-mails')
      fireEvent.press(toggleSwitch)

      await act(async () => {
        fireEvent.press(screen.getByTestId('Enregistrer les modifications'))
      })

      expect(mockGoBack).toHaveBeenCalledTimes(1)
    })

    it('should call analytics when pressing the save button', async () => {
      mockApiUpdateProfile({
        subscriptions: {
          marketingEmail: false,
          marketingPush: false,
        },
      } as UserProfileResponse)
      renderNotificationSettings(
        'granted',
        {
          subscriptions: {
            marketingEmail: false,
            marketingPush: true,
          },
        } as UserProfileResponse,
        true
      )

      await screen.findByText('Autoriser l’envoi d’e-mails')

      const toggleSwitch = screen.getByTestId('Interrupteur Autoriser les notifications marketing')
      fireEvent.press(toggleSwitch)

      await act(async () => {
        fireEvent.press(screen.getByTestId('Enregistrer les modifications'))
      })

      expect(analytics.logNotificationToggle).toHaveBeenCalledWith(false, false)
    })
  })
})

function renderNotificationSettings(
  expectedPermission: NotificationsResponse['status'],
  user?: UserProfileResponse,
  isLoggedIn?: boolean
) {
  mockUseAuthContext.mockReturnValue({
    isLoggedIn: isLoggedIn ?? true,
    user,
  } as Auth.IAuthContext)

  const checkNotifications = jest.spyOn(RNP, 'checkNotifications')
  checkNotifications.mockResolvedValue({
    status: expectedPermission,
    settings: {},
  })

  return render(reactQueryProviderHOC(<NotificationSettingsDeprecated />))
}

const mockApiUpdateProfile = (user?: UserProfileResponse) => {
  mockUseAuthContext.mockReturnValueOnce({ isLoggedIn: true, user } as Auth.IAuthContext)
  mockServer.postApi('/v1/profile', user)
}
