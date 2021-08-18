import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { Text } from 'react-native'

import { IdCheck } from 'features/auth/signup/IdCheck'
import { RootStackParamList } from 'features/navigation/RootNavigator'
import { env } from 'libs/environment'
import { storage } from 'libs/storage'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, cleanup, render, waitFor } from 'tests/utils'

jest.mock('@react-navigation/native', () => jest.requireActual('@react-navigation/native'))

describe('<IdCheck />', () => {
  afterEach(async () => {
    await storage.clear('has_accepted_cookie')
    cleanup()
  })

  it('should render correctly', async () => {
    const renderAPI = renderIdCheckWithNavigation()
    await waitFor(() => {
      expect(renderAPI).toMatchSnapshot()
    })
  })

  it('should display web page with url with user_consent_data_collection unset', async () => {
    const renderAPI = renderIdCheckWithNavigation()

    await waitFor(() => {
      const webview = renderAPI.getByTestId('idcheck-webview')
      expect(webview.props.source.uri).toEqual(
        env.ID_CHECK_URL +
          '/?email=john%2B1%40wick.com&user_consent_data_collection=false&licence_token=XxLicenceTokenxX&expiration_timestamp=1622065697871&expiration_timestamp=1622065697871'
      )
    })
  })

  it('should display web page with url with user_consent_data_collection set to false', async () => {
    storage.saveObject('has_accepted_cookie', false)
    const renderAPI = renderIdCheckWithNavigation()

    await waitFor(() => {
      const webview = renderAPI.getByTestId('idcheck-webview')
      expect(webview.props.source.uri).toEqual(
        env.ID_CHECK_URL +
          '/?email=john%2B1%40wick.com&user_consent_data_collection=false&licence_token=XxLicenceTokenxX&expiration_timestamp=1622065697871&expiration_timestamp=1622065697871'
      )
    })
  })

  it('should display web page with url with user_consent_data_collection set to true', async () => {
    storage.saveObject('has_accepted_cookie', true)
    const renderAPI = renderIdCheckWithNavigation()

    await waitFor(() => {
      const webview = renderAPI.getByTestId('idcheck-webview')
      expect(webview.props.source.uri).toEqual(
        env.ID_CHECK_URL +
          '/?email=john%2B1%40wick.com&user_consent_data_collection=true&licence_token=XxLicenceTokenxX&expiration_timestamp=1622065697871&expiration_timestamp=1622065697871'
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
      const notWebviewText = renderAPI.findByText('NotIdCheck Page')
      expect(notWebviewText).toBeTruthy()
    })
  })
})

type StackParamList = {
  IdCheck: RootStackParamList['IdCheck']
  NotIdCheck: undefined
}

const Stack = createStackNavigator<StackParamList>()

const navigationRef = React.createRef<NavigationContainerRef<Record<string, unknown>>>()

function navigate(name: string) {
  navigationRef.current?.navigate(name)
}

const NotIdCheck = () => <Text>NotIdCheck Page</Text>

function renderIdCheckWithNavigation() {
  return render(
    reactQueryProviderHOC(
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator initialRouteName="IdCheck">
          <Stack.Screen
            name="IdCheck"
            component={IdCheck}
            initialParams={{
              email: 'john+1@wick.com',
              licence_token: 'XxLicenceTokenxX',
              expiration_timestamp: new Date('2021-05-26T21:48:17.871Z').getTime(),
            }}
          />
          <Stack.Screen name="NotIdCheck" component={NotIdCheck} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  )
}
