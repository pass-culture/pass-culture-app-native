import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { rest } from 'msw'
import React from 'react'
import { Platform } from 'react-native'
import * as RNP from 'react-native-permissions'
import { NotificationsResponse, PermissionStatus } from 'react-native-permissions'
import { act, ReactTestInstance } from 'react-test-renderer'
import waitForExpect from 'wait-for-expect'

import { UserProfileResponse } from 'api/gen'
import { IAuthContext, useAuthContext } from 'features/auth/AuthContext'
import { RootStackParamList } from 'features/navigation/RootNavigator/types'
import { env } from 'libs/environment'
import { analytics } from 'libs/firebase/analytics'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { superFlushWithAct, fireEvent, render, cleanup } from 'tests/utils'

import { NotificationSettings } from './NotificationSettings'

jest.mock('features/auth/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>

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

// We allow console.error here because of act warning that we can't reproduce locally
// We allow warning for android 'Expected style "elevation: 4px" to be unitless' due to shadow style
// eslint-disable-next-line local-rules/no-allow-console
allowConsole({ error: true, warn: true })
describe('NotificationSettings', () => {
  afterEach(() => {
    cleanup()
  })

  describe('Display correct switches', () => {
    it('should display the both switches on ios', async () => {
      Platform.OS = 'ios'
      const { queryByText } = await renderNotificationSettings('granted', {} as UserProfileResponse)
      await waitForExpect(() => {
        queryByText('Autoriser l’envoi d’e-mails')
        queryByText('Autoriser les notifications marketing')
      })
    })

    it('should only display the email switch on android', async () => {
      Platform.OS = 'android'
      const { queryByText } = await renderNotificationSettings('granted', {} as UserProfileResponse)
      await waitForExpect(() => {
        queryByText('Autoriser l’envoi d’e-mails')
      })
    })
  })

  describe('Display the push switch properly (only iOS)', () => {
    it('should display an enabled switch', async () => {
      Platform.OS = 'ios'
      const { getAllByTestId } = await renderNotificationSettings('granted', {
        subscriptions: {
          marketingEmail: false,
          marketingPush: true,
        },
      } as UserProfileResponse)
      const pushSwitch = getAllByTestId('Interrupteur')[1]
      await waitForExpect(() =>
        expect(pushSwitch.parent?.props.accessibilityState.checked).toBeTruthy()
      )
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
        const { getAllByTestId } = await renderNotificationSettings(permission, {
          subscriptions: {
            marketingEmail: false,
            marketingPush,
          },
        } as UserProfileResponse)
        const pushSwitch = getAllByTestId('Interrupteur')[1]
        await waitForExpect(() =>
          expect(pushSwitch.parent?.props.accessibilityState.checked).toBeFalsy()
        )
      }
    )
  })

  describe('The transitions of the push switch', () => {
    it('should enable the switch when permission=="granted" and push previously not allowed', async () => {
      const { getAllByTestId } = await renderNotificationSettings('granted', {
        subscriptions: {
          marketingEmail: true,
          marketingPush: false,
        },
      } as UserProfileResponse)
      await act(async () => {
        await waitForExpect(() => {
          const toggleSwitch = getAllByTestId('Interrupteur')[1]
          fireEvent.press(toggleSwitch)
        })
      })
      await superFlushWithAct(10)
      await waitForExpect(() => {
        const toggleSwitch = getAllByTestId('Interrupteur')[1]
        // expect activated
        expect(toggleSwitch.parent?.props.accessibilityState.checked).toBeTruthy()
        expect((toggleSwitch.children[0] as ReactTestInstance).props.active).toBeTruthy()
      })
    })

    it('should disable the switch when permission=="granted" and push previously allowed', async () => {
      const { getAllByTestId } = await renderNotificationSettings('granted', {
        subscriptions: {
          marketingEmail: true,
          marketingPush: true,
        },
      } as UserProfileResponse)
      await act(async () => {
        await waitForExpect(() => {
          const toggleSwitch = getAllByTestId('Interrupteur')[1]
          fireEvent.press(toggleSwitch)
        })
      })
      await superFlushWithAct(10)
      await waitForExpect(() => {
        const toggleSwitch = getAllByTestId('Interrupteur')[1]
        // expect not activated
        expect(toggleSwitch.parent?.props.accessibilityState.checked).toBeFalsy()
        expect((toggleSwitch.children[0] as ReactTestInstance).props.active).toBeFalsy()
      })
    })

    it.each<PermissionStatus>(['unavailable', 'blocked', 'denied', 'limited'])(
      'should open the modal when permission!="granted" (==%s) and trying to allow',
      async (permission) => {
        const { getAllByTestId } = await renderNotificationSettings(permission, {
          subscriptions: {
            marketingEmail: true,
            marketingPush: false, // the user push setting doesnt care
          },
        } as UserProfileResponse)
        await act(async () => {
          await waitForExpect(() => {
            const toggleSwitch = getAllByTestId('Interrupteur')[1]
            fireEvent.press(toggleSwitch)
          })
        })
        await superFlushWithAct(10)
        await waitForExpect(() => {
          getAllByTestId('modal-notifications-permission-modal')
        })
      }
    )
  })

  describe('The behavior of the save button', () => {
    it('should not be displayed when for unauthenticated users', async () => {
      const { queryByTestId } = await renderNotificationSettings(
        'granted',
        {
          subscriptions: {},
        } as UserProfileResponse,
        false
      )
      let saveButton: ReactTestInstance | null = null
      saveButton = queryByTestId('Enregistrer les modifications')

      await waitForExpect(() => {
        expect(saveButton).toBeFalsy()
      })
    })

    it('should enable the save button when the email switch changed', async () => {
      mockApiUpdateProfile({
        subscriptions: {
          marketingEmail: false,
          marketingPush: true,
        },
      } as UserProfileResponse)
      const { getByTestId, getAllByTestId } = await renderNotificationSettings(
        'granted',
        {
          subscriptions: {
            marketingEmail: true,
            marketingPush: true,
          },
        } as UserProfileResponse,
        true
      )

      await act(async () => {
        await waitForExpect(() => {
          const toggleSwitch = getAllByTestId('Interrupteur')[0]
          fireEvent.press(toggleSwitch)
        })
      })

      let saveButton: ReactTestInstance | null = null
      await superFlushWithAct(10)
      await waitForExpect(() => {
        saveButton = getByTestId('Enregistrer les modifications')
        expect(saveButton).toBeEnabled()
      })

      act(() => {
        saveButton && fireEvent.press(saveButton)
      })

      await superFlushWithAct()
      await waitForExpect(() => {
        saveButton = getByTestId('Enregistrer les modifications')
        expect(saveButton).toBeDisabled()
      })
    })

    it('should enable the save button when the push switch changed and call analytics when pressed', async () => {
      Platform.OS = 'ios'
      mockApiUpdateProfile({
        subscriptions: {
          marketingEmail: false,
          marketingPush: false,
        },
      } as UserProfileResponse)
      const { getByTestId, getAllByTestId } = await renderNotificationSettings(
        'granted',
        {
          subscriptions: {
            marketingEmail: false,
            marketingPush: true,
          },
        } as UserProfileResponse,
        true
      )

      await act(async () => {
        await waitForExpect(() => {
          const toggleSwitch = getAllByTestId('Interrupteur')[1]
          fireEvent.press(toggleSwitch)
        })
      })

      await superFlushWithAct(20)
      let saveButton: ReactTestInstance | null = null
      await waitForExpect(() => {
        saveButton = getByTestId('Enregistrer les modifications')
        expect(saveButton).toBeEnabled()
      })

      act(() => {
        saveButton && fireEvent.press(saveButton)
      })

      await superFlushWithAct()
      await waitForExpect(() => {
        expect(getByTestId('Enregistrer les modifications')).toBeDisabled()
        expect(analytics.logNotificationToggle).toBeCalledWith(false, false)
      })
    })
  })
})

const Stack = createStackNavigator<RootStackParamList>()

const navigationRef = createNavigationContainerRef<RootStackParamList>()

async function renderNotificationSettings(
  expectedPermission: NotificationsResponse['status'],
  user?: UserProfileResponse,
  isLoggedIn?: boolean
) {
  mockUseAuthContext.mockImplementation(() => ({ isLoggedIn: isLoggedIn ?? true } as IAuthContext))

  const checkNotifications = jest.spyOn(RNP, 'checkNotifications')
  checkNotifications.mockResolvedValue({
    status: expectedPermission,
    settings: {},
  })

  mockApiGetMe(user)

  const wrapper = render(
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    reactQueryProviderHOC(
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator initialRouteName="NotificationSettings">
          <Stack.Screen name="NotificationSettings" component={NotificationSettings} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  )

  await superFlushWithAct()
  return wrapper
}

const mockApiGetMe = (user?: UserProfileResponse) => {
  server.use(
    rest.get(env.API_BASE_URL + '/native/v1/me', (_req, res, ctx) => {
      return res(ctx.status(200), ctx.json(user))
    })
  )
}

const mockApiUpdateProfile = (user?: UserProfileResponse) => {
  server.use(
    rest.post(env.API_BASE_URL + '/native/v1/profile', (_req, res, ctx) => {
      return res.once(ctx.status(200), ctx.json(user))
    })
  )
}
