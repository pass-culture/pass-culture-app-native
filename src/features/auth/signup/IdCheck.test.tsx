import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native'
import { createStackNavigator, StackScreenProps } from '@react-navigation/stack'
import React from 'react'
import { Text } from 'react-native'

import { useAppSettings } from 'features/auth/settings'
import { IdCheck } from 'features/auth/signup/IdCheck'
import { RootStackParamList } from 'features/navigation/RootNavigator'
import { env } from 'libs/environment'
import { storage } from 'libs/storage'
import { act, render, waitFor } from 'tests/utils'

const EMAIL = 'john+1@wick.com'
const LICENCE_TOKEN = 'XxLicenceTokenxX'

jest.mock('@react-navigation/native', () => jest.requireActual('@react-navigation/native'))

const mockUseAppSettings = useAppSettings as jest.MockedFunction<typeof useAppSettings>
jest.mock('features/auth/settings')

allowConsole({ error: true })
/* Explanation for allowConsole : 
The test `should display web page with url with user_consent_data_collection set to true`
fails because of `Warning: You called act(async () => ...) without await...`.
Adding `await superFlushWithAct` does not fix the console.error.
*/

describe('<IdCheck />', () => {
  beforeEach(() => {
    mockAppSettings({ enableNativeIdCheckVersion: false, isLoading: false })
  })
  afterEach(async () => {
    await storage.clear('has_accepted_cookie')
  })

  it('should not display anything while settings are not loaded', async () => {
    mockAppSettings({ enableNativeIdCheckVersion: true, isLoading: true })
    const renderAPI = renderIdCheckWithNavigation()

    await waitFor(() => {
      const webview = renderAPI.queryByTestId('idcheck-webview')
      expect(webview).toBeFalsy()
      const idCheckV2Text = renderAPI.queryByText(`email=${EMAIL};licence_token=${LICENCE_TOKEN}`)
      expect(idCheckV2Text).toBeFalsy()
      const notWebviewText = renderAPI.queryByText('NotIdCheck Page')
      expect(notWebviewText).toBeFalsy()
    })
  })

  it('should navigate to IdCheckV2 when setting enableNativeIdCheckVersion is true', async () => {
    mockAppSettings({ enableNativeIdCheckVersion: true, isLoading: false })
    const renderAPI = renderIdCheckWithNavigation()

    await waitFor(() => {
      const webview = renderAPI.queryByTestId('idcheck-webview')
      expect(webview).toBeFalsy()
      const idCheckV2Text = renderAPI.getByText(`email=${EMAIL};licence_token=${LICENCE_TOKEN}`)
      expect(idCheckV2Text).toBeTruthy()
    })
  })

  it('should render correctly', async () => {
    const renderAPI = renderIdCheckWithNavigation()
    await waitFor(() => {
      expect(renderAPI).toMatchSnapshot()
    })
  })

  it('should display web page with url with user_consent_data_collection set to false', async () => {
    const renderAPI = renderIdCheckWithNavigation()

    await waitFor(() => {
      const webview = renderAPI.getByTestId('idcheck-webview')
      expect(webview.props.source.uri).toEqual(
        env.ID_CHECK_URL +
          '/?email=john%2B1%40wick.com&user_consent_data_collection=false&licence_token=XxLicenceTokenxX'
      )
    })
  })

  it('should display web page with url with user_consent_data_collection set to true', async () => {
    await storage.saveObject('has_accepted_cookie', true)

    const renderAPI = renderIdCheckWithNavigation()

    await waitFor(() => {
      const webview = renderAPI.getByTestId('idcheck-webview')
      expect(webview.props.source.uri).toEqual(
        env.ID_CHECK_URL +
          '/?email=john%2B1%40wick.com&user_consent_data_collection=true&licence_token=XxLicenceTokenxX'
      )
    })
  })

  it('should not display webview when navigating to another screen', async () => {
    const renderAPI = renderIdCheckWithNavigation()

    act(() => {
      navigate('NotIdCheck')
    })

    await waitFor(() => {
      const webview = renderAPI.queryByTestId('idcheck-webview')
      expect(webview).toBeFalsy()
      const notWebviewText = renderAPI.getByText('NotIdCheck Page')
      expect(notWebviewText).toBeTruthy()
    })
  })
})

type StackParamList = {
  IdCheck: RootStackParamList['IdCheck']
  IdCheckV2: RootStackParamList['IdCheckV2']
  NotIdCheck: undefined
}

const Stack = createStackNavigator<StackParamList>()

const navigationRef = React.createRef<NavigationContainerRef>()

function navigate(name: string) {
  navigationRef.current?.navigate(name)
}

const NotIdCheck = () => <Text>NotIdCheck Page</Text>
const IdCheckV2 = (props: StackScreenProps<StackParamList, 'IdCheckV2'>) => {
  const { email, licence_token } = props.route.params
  return <Text>{`email=${email};licence_token=${licence_token}`}</Text>
}

function renderIdCheckWithNavigation() {
  return render(
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="IdCheck">
        <Stack.Screen
          name="IdCheck"
          component={IdCheck}
          initialParams={{
            email: EMAIL,
            licenceToken: LICENCE_TOKEN,
          }}
        />
        <Stack.Screen name="NotIdCheck" component={NotIdCheck} />
        <Stack.Screen name="IdCheckV2" component={IdCheckV2} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

function mockAppSettings({
  enableNativeIdCheckVersion,
  isLoading,
}: {
  enableNativeIdCheckVersion: boolean
  isLoading: boolean
}) {
  mockUseAppSettings.mockReturnValue({
    data: {
      enableNativeIdCheckVersion,
    },
    isLoading,
  } as ReturnType<typeof useAppSettings>)
}
