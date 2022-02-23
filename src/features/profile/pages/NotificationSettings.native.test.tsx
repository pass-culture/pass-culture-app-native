import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { rest } from 'msw'
import React from 'react'
import { Platform } from 'react-native'
import * as RNP from 'react-native-permissions'
import { NotificationsResponse, PermissionStatus } from 'react-native-permissions'
import { ReactTestInstance } from 'react-test-renderer'
import waitForExpect from 'wait-for-expect'

import { UserProfileResponse } from 'api/gen'
import { IAuthContext, useAuthContext } from 'features/auth/AuthContext'
import { RootStackParamList } from 'features/navigation/RootNavigator'
import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { flushAllPromises, superFlushWithAct, act, fireEvent, render, cleanup } from 'tests/utils'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

import { NotificationSettings } from './NotificationSettings'

// eslint-disable-next-line local-rules/no-allow-console
allowConsole({ error: true })

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

describe('NotificationSettings', () => {
  afterEach(() => {
    cleanup()
  })

  it('should display the both switches on ios', async () => {
    Platform.OS = 'ios'
    const { queryByText } = await renderNotificationSettings('granted', {} as UserProfileResponse)
    await superFlushWithAct(10)
    await waitForExpect(() => {
      queryByText('Autoriser l’envoi d’e-mails')
      queryByText('Autoriser les notifications marketing')
    })
  })

  // TODO : see why it use an elevation 4px in a next ticket
  it.skip('should only display the email switch on android', async () => {
    Platform.OS = 'android'
    const { queryByText } = await renderNotificationSettings('granted', {} as UserProfileResponse)
    await superFlushWithAct(10)
    await waitForExpect(() => {
      queryByText('Autoriser l’envoi d’e-mails')
    })
  })

  describe('Display the push switch properly (only iOS)', () => {
    it('should display an enabled switch', async () => {
      Platform.OS = 'ios'
      const { getByTestId } = await renderNotificationSettings('granted', {
        subscriptions: {
          marketingEmail: false,
          marketingPush: true,
        },
      } as UserProfileResponse)
      await superFlushWithAct(10)
      const pushSwitch = getByTestId("Interrupteur d'autorisation des notifications marketing")
      await waitForExpect(() =>
        expect(pushSwitch.parent?.props.accessibilityValue.text).toBe('true')
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
        const { getByTestId } = await renderNotificationSettings(permission, {
          subscriptions: {
            marketingEmail: false,
            marketingPush,
          },
        } as UserProfileResponse)
        const pushSwitch = getByTestId("Interrupteur d'autorisation des notifications marketing")
        await superFlushWithAct(10)
        await waitForExpect(() =>
          expect(pushSwitch.parent?.props.accessibilityValue.text).toBe('false')
        )
      }
    )
  })

  describe('The transitions of the push switch', () => {
    it('should enable the switch when permission=="granted" and push previously not allowed', async () => {
      const { getByTestId } = await renderNotificationSettings('granted', {
        subscriptions: {
          marketingEmail: true,
          marketingPush: false,
        },
      } as UserProfileResponse)
      await superFlushWithAct(10)
      await waitForExpect(() => {
        const toggleSwitch = getByTestId("Interrupteur d'autorisation des notifications marketing")
        fireEvent.press(toggleSwitch)
      })
      await superFlushWithAct(10)
      await waitForExpect(() => {
        const toggleSwitch = getByTestId("Interrupteur d'autorisation des notifications marketing")
        // expect activated
        expect(toggleSwitch.parent?.props.accessibilityValue.text).toBe('true')
        expect((toggleSwitch.children[0] as ReactTestInstance).props.active).toBeTruthy()
      })
    })

    it('should disable the switch when permission=="granted" and push previously allowed', async () => {
      const { getByTestId } = await renderNotificationSettings('granted', {
        subscriptions: {
          marketingEmail: true,
          marketingPush: true,
        },
      } as UserProfileResponse)
      await superFlushWithAct(10)
      await waitForExpect(() => {
        const toggleSwitch = getByTestId("Interrupteur d'autorisation des notifications marketing")
        fireEvent.press(toggleSwitch)
      })
      await superFlushWithAct(10)
      await waitForExpect(() => {
        const toggleSwitch = getByTestId("Interrupteur d'autorisation des notifications marketing")
        // expect not activated
        expect(toggleSwitch.parent?.props.accessibilityValue.text).toBe('false')
        expect((toggleSwitch.children[0] as ReactTestInstance).props.active).toBeFalsy()
      })
    })

    it.each<PermissionStatus>(['unavailable', 'blocked', 'denied', 'limited'])(
      'should open the modal when permission!="granted" (==%s) and trying to allow',
      async (permission) => {
        const { getByTestId } = await renderNotificationSettings(permission, {
          subscriptions: {
            marketingEmail: true,
            marketingPush: false, // the user push setting doesnt care
          },
        } as UserProfileResponse)
        await superFlushWithAct(10)
        await waitForExpect(() => {
          const toggleSwitch = getByTestId(
            "Interrupteur d'autorisation des notifications marketing"
          )
          fireEvent.press(toggleSwitch)
        })
        await superFlushWithAct(10)
        await waitForExpect(() => {
          getByTestId('modal-notifications-permission-modal')
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
      saveButton = queryByTestId('Enregistrer')

      await superFlushWithAct(10)
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
      const { getByTestId } = await renderNotificationSettings(
        'granted',
        {
          subscriptions: {
            marketingEmail: true,
            marketingPush: true,
          },
        } as UserProfileResponse,
        true
      )

      await superFlushWithAct(10)
      await waitForExpect(() => {
        const toggleSwitch = getByTestId("Interrupteur d'autorisation d'envoi des e-mails")
        fireEvent.press(toggleSwitch)
      })

      let saveButton: ReactTestInstance | null = null
      await superFlushWithAct(10)
      await waitForExpect(() => {
        saveButton = getByTestId('Enregistrer')
        expect(saveButton?.props.style.backgroundColor).toEqual(ColorsEnum.PRIMARY)
      })

      saveButton && fireEvent.press(saveButton)

      await superFlushWithAct(10)
      await waitForExpect(() => {
        saveButton = getByTestId('Enregistrer')
        expect(saveButton?.props.style.backgroundColor).toEqual(ColorsEnum.GREY_LIGHT)
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
      const { getByTestId } = await renderNotificationSettings(
        'granted',
        {
          subscriptions: {
            marketingEmail: false,
            marketingPush: true,
          },
        } as UserProfileResponse,
        true
      )

      await superFlushWithAct(10)
      await waitForExpect(() => {
        const toggleSwitch = getByTestId("Interrupteur d'autorisation des notifications marketing")
        fireEvent.press(toggleSwitch)
      })

      await superFlushWithAct(20)
      let saveButton: ReactTestInstance | null = null
      await waitForExpect(() => {
        saveButton = getByTestId('Enregistrer')
        expect(saveButton?.props.style.backgroundColor).toEqual(ColorsEnum.PRIMARY)
      })

      saveButton && fireEvent.press(saveButton)

      await superFlushWithAct(10)

      await waitForExpect(() => {
        expect(getByTestId('Enregistrer').props.style.backgroundColor).toEqual(
          ColorsEnum.GREY_LIGHT
        )
      })
      await waitForExpect(async () => {
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

  await act(async () => {
    await flushAllPromises()
  })

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
