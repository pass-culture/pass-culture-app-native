import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { rest } from 'msw'
import React from 'react'
import { Platform } from 'react-native'
import * as RNP from 'react-native-permissions'
import { NotificationsResponse, PermissionStatus } from 'react-native-permissions'
import { ReactTestInstance } from 'react-test-renderer'

import { UserProfileResponse } from 'api/gen'
import * as Auth from 'features/auth/context/AuthContext'
import { RootStackParamList } from 'features/navigation/RootNavigator/types'
import { env } from 'libs/environment'
import { analytics } from 'libs/firebase/analytics'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { fireEvent, render, screen, flushAllPromisesWithAct } from 'tests/utils'

import { NotificationSettings } from './NotificationSettings'

jest.mock('features/auth/context/AuthContext')
const mockUseAuthContext = Auth.useAuthContext as jest.Mock

jest.mock('@react-navigation/native', () => ({
  ...(jest.requireActual('@react-navigation/native') as Record<string, unknown>),
  useRoute: jest.fn().mockImplementation(() => ({
    key: 'ksdqldkmqdmqdq',
  })),
  useNavigation: jest.fn().mockReturnValue({
    goBack: jest.fn(),
  }),
}))
jest.mock('@react-navigation/stack', () => jest.requireActual('@react-navigation/stack'))

describe('NotificationSettings', () => {
  describe('Display correct switches', () => {
    it('should display the both switches on ios', async () => {
      Platform.OS = 'ios'
      renderNotificationSettings('granted', {} as UserProfileResponse)

      await flushAllPromisesWithAct()

      expect(screen.queryByText('Autoriser l’envoi d’e-mails')).toBeTruthy()
      expect(screen.queryByText('Autoriser les notifications marketing')).toBeTruthy()
    })

    it('should only display the email switch on android', async () => {
      // FIXME(PC-211174): This warning comes from android 'Expected style "elevation: 4px" to be unitless' due to shadow style (https://passculture.atlassian.net/browse/PC-21174)
      jest.spyOn(global.console, 'warn').mockImplementationOnce(() => null)

      Platform.OS = 'android'
      renderNotificationSettings('granted', {} as UserProfileResponse)

      await flushAllPromisesWithAct()

      expect(screen.queryByText('Autoriser l’envoi d’e-mails')).toBeTruthy()
      expect(screen.queryByText('Autoriser les notifications marketing')).toBeFalsy()
    })
  })

  describe('Display the push switch properly (only iOS)', () => {
    it('should display an enabled switch', async () => {
      Platform.OS = 'ios'
      renderNotificationSettings('granted', {
        subscriptions: {
          marketingEmail: false,
          marketingPush: true,
        },
      } as UserProfileResponse)

      await flushAllPromisesWithAct()

      const pushSwitch = screen.getAllByTestId('Interrupteur')[1]
      expect(pushSwitch.parent?.props.accessibilityState.checked).toBeTruthy()
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
        Platform.OS = 'ios'
        renderNotificationSettings(permission, {
          subscriptions: {
            marketingEmail: false,
            marketingPush,
          },
        } as UserProfileResponse)

        await flushAllPromisesWithAct()

        const pushSwitch = screen.getAllByTestId('Interrupteur')[1]
        expect(pushSwitch.parent?.props.accessibilityState.checked).toBeFalsy()
      }
    )
  })

  describe('The transitions of the push switch', () => {
    it('should enable the switch when permission=="granted" and push previously not allowed', async () => {
      renderNotificationSettings('granted', {
        subscriptions: {
          marketingEmail: true,
          marketingPush: false,
        },
      } as UserProfileResponse)

      await flushAllPromisesWithAct()

      const toggleSwitch = screen.getAllByTestId('Interrupteur')[1]
      fireEvent.press(toggleSwitch)

      await flushAllPromisesWithAct()

      expect(toggleSwitch.parent?.props.accessibilityState.checked).toBeTruthy()
      expect((toggleSwitch.children[0] as ReactTestInstance).props.active).toBeTruthy()
    })

    it('should disable the switch when permission=="granted" and push previously allowed', async () => {
      renderNotificationSettings('granted', {
        subscriptions: {
          marketingEmail: true,
          marketingPush: true,
        },
      } as UserProfileResponse)

      await flushAllPromisesWithAct()

      const toggleSwitch = screen.getAllByTestId('Interrupteur')[1]
      fireEvent.press(toggleSwitch)

      await flushAllPromisesWithAct()

      expect(toggleSwitch.parent?.props.accessibilityState.checked).toBeFalsy()
      expect((toggleSwitch.children[0] as ReactTestInstance).props.active).toBeFalsy()
    })

    it.each<PermissionStatus>(['unavailable', 'blocked', 'denied', 'limited'])(
      'should open the modal when permission!="granted" (==%s) and trying to allow',
      async (permission) => {
        renderNotificationSettings(permission, {
          subscriptions: {
            marketingEmail: true,
            marketingPush: false, // the user push setting doesnt care
          },
        } as UserProfileResponse)

        const toggleSwitch = screen.getAllByTestId('Interrupteur')[1]
        fireEvent.press(toggleSwitch)

        await flushAllPromisesWithAct()

        expect(screen.queryAllByTestId('modal-notifications-permission-modal')).toBeTruthy()
      }
    )
  })

  describe('The behavior of the save button', () => {
    it('should not be displayed when for unauthenticated users', async () => {
      renderNotificationSettings(
        'granted',
        {
          subscriptions: {},
        } as UserProfileResponse,
        false
      )
      let saveButton: ReactTestInstance | null = null
      saveButton = screen.queryByTestId('Enregistrer les modifications')

      await flushAllPromisesWithAct()

      expect(saveButton).toBeFalsy()
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

      await flushAllPromisesWithAct()

      const toggleSwitch = screen.getAllByTestId('Interrupteur')[0]
      fireEvent.press(toggleSwitch)

      let saveButton: ReactTestInstance | null = null
      saveButton = screen.getByTestId('Enregistrer les modifications')
      expect(saveButton).toBeEnabled()

      fireEvent.press(saveButton)

      await flushAllPromisesWithAct()

      saveButton = screen.getByTestId('Enregistrer les modifications')
      expect(saveButton).toBeDisabled()
    })

    it('should enable the save button when the push switch changed and call analytics when pressed', async () => {
      Platform.OS = 'ios'
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

      await flushAllPromisesWithAct()

      const toggleSwitch = screen.getAllByTestId('Interrupteur')[1]
      fireEvent.press(toggleSwitch)

      let saveButton: ReactTestInstance | null = null
      saveButton = screen.getByTestId('Enregistrer les modifications')
      expect(saveButton).toBeEnabled()

      fireEvent.press(saveButton)

      await flushAllPromisesWithAct()

      expect(screen.getByTestId('Enregistrer les modifications')).toBeDisabled()
      expect(analytics.logNotificationToggle).toBeCalledWith(false, false)
    })
  })
})

const Stack = createStackNavigator<RootStackParamList>()

const navigationRef = createNavigationContainerRef<RootStackParamList>()

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

  return render(
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    reactQueryProviderHOC(
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator initialRouteName="NotificationSettings">
          <Stack.Screen name="NotificationSettings" component={NotificationSettings} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  )
}

const mockApiUpdateProfile = (user?: UserProfileResponse) => {
  server.use(
    rest.post(env.API_BASE_URL + '/native/v1/profile', (_req, res, ctx) => {
      mockUseAuthContext.mockReturnValueOnce({ isLoggedIn: true, user } as Auth.IAuthContext)
      return res.once(ctx.status(200), ctx.json(user))
    })
  )
}
