import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { act, render, waitFor } from '@testing-library/react-native'
import React from 'react'
import { Text } from 'react-native'

import { IdCheck } from 'features/auth/signup/IdCheck'
import { RootStackParamList } from 'features/navigation/RootNavigator'
import { env } from 'libs/environment'
import { storage } from 'libs/storage'

jest.mock('@react-navigation/native', () => jest.requireActual('@react-navigation/native'))

allowConsole({ error: true })
/* Explanation for allowConsole : 
The test `should display web page with url with user_consent_data_collection set to true`
fails because of `Warning: You called act(async () => ...) without await...`.
Adding `await superFlushWithAct` does not fix the console.error.
*/

describe('<IdCheck />', () => {
  afterEach(async () => {
    await storage.clear('has_accepted_cookie')
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
  NotIdCheck: undefined
}

const Stack = createStackNavigator<StackParamList>()

const navigationRef = React.createRef<NavigationContainerRef>()

function navigate(name: string) {
  navigationRef.current?.navigate(name)
}

const NotIdCheck = () => <Text>NotIdCheck Page</Text>

function renderIdCheckWithNavigation() {
  return render(
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="IdCheck">
        <Stack.Screen
          name="IdCheck"
          component={IdCheck}
          initialParams={{
            email: 'john+1@wick.com',
            licenceToken: 'XxLicenceTokenxX',
          }}
        />
        <Stack.Screen name="NotIdCheck" component={NotIdCheck} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
