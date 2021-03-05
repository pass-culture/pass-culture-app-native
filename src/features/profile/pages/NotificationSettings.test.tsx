import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { act, render } from '@testing-library/react-native'
import React from 'react'
import { Platform } from 'react-native'
import * as RNP from 'react-native-permissions'
import { NotificationsResponse, PermissionStatus } from 'react-native-permissions'
import waitForExpect from 'wait-for-expect'

import { UserProfileResponse } from 'api/gen'
import { useUserProfileInfo } from 'features/home/api'
import { RootStackParamList } from 'features/navigation/RootNavigator'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { flushAllPromises } from 'tests/utils'

import { NotificationSettings } from './NotificationSettings'

jest.mock('@react-navigation/native', () => jest.requireActual('@react-navigation/native'))

const useUserProfileInfoMock = useUserProfileInfo as jest.Mock

jest.mock('features/home/api', () => ({
  useUserProfileInfo: jest.fn(() => ({ data: { isBeneficiary: true } })),
}))

const checkPermissions = jest.spyOn(RNP, 'checkNotifications')

describe('NotificationSettings', () => {
  it('should display the both switches on ios', async () => {
    Platform.OS = 'ios'
    const { getByText } = await renderNotificationSettings()
    getByText('Autoriser l’envoi d’e-mails')
    getByText('Autoriser les notifications marketing')
  })
  it('should only display the email switch on android', async () => {
    Platform.OS = 'android'
    const { getByText } = await renderNotificationSettings()
    getByText('Autoriser l’envoi d’e-mails')
  })
  describe('Push switch (only iOS)', () => {
    beforeEach(() => checkPermissions.mockRestore())

    it('should display an enabled switch', async () => {
      Platform.OS = 'ios'

      const { getByTestId } = await renderNotificationSettings('granted', {
        subscriptions: {
          marketing_email: false,
          marketing_push: true,
        },
      } as UserProfileResponse)

      const pushSwitch = getByTestId('push-switch-background')

      await waitForExpect(() => expect(pushSwitch.props.active).toBeTruthy())
    })
    it.each<[PermissionStatus, boolean]>([
      ['unavailable', true],
      ['blocked', true],
      ['denied', true],
      ['limited', true],
      ['granted', false],
    ])(
      'should display a disabled switch when permission="%s" and marketing_push="%s"',
      async (permission, marketing_push) => {
        Platform.OS = 'ios'

        const { getByTestId } = await renderNotificationSettings(permission, {
          subscriptions: {
            marketing_email: false,
            marketing_push,
          },
        } as UserProfileResponse)

        const pushSwitch = getByTestId('push-switch-background')

        await waitForExpect(() => expect(pushSwitch.props.active).toBeFalsy())
      }
    )
  })
})

const Stack = createStackNavigator<RootStackParamList>()

const navigationRef = React.createRef<NavigationContainerRef>()

async function renderNotificationSettings(
  expectedPermission?: NotificationsResponse['status'],
  user?: UserProfileResponse
) {
  expectedPermission &&
    checkPermissions.mockReturnValue(
      Promise.resolve({
        status: expectedPermission,
        settings: {},
      })
    )

  user &&
    useUserProfileInfoMock.mockImplementationOnce(() => ({
      data: user,
    }))

  const wrapper = render(
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
