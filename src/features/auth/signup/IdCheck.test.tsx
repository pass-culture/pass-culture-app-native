import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { act, render, waitFor } from '@testing-library/react-native'
import React from 'react'
import { Text } from 'react-native'

import { IdCheck } from 'features/auth/signup/IdCheck'
import { RootStackParamList } from 'features/navigation/RootNavigator'
import { env } from 'libs/environment'

jest.mock('@react-navigation/native', () => jest.requireActual('@react-navigation/native'))

describe('<IdCheck />', () => {
  it('should render correctly', async () => {
    const instance = renderIdCheckWithNavigation()
    await waitFor(() => {
      expect(instance).toMatchSnapshot()
    })
  })

  it('should display web page with correct url', async () => {
    const { getByTestId } = renderIdCheckWithNavigation()
    const webview = getByTestId('idcheck-webview')

    await waitFor(() => {
      expect(webview.props.source.uri).toEqual(
        env.ID_CHECK_URL + '/?email=john%2B1%40wick.com&licence_token=XxLicenceTokenxX'
      )
    })
  })

  it('should not display webview when navigating to another screen', async () => {
    const { queryByTestId, getByText } = renderIdCheckWithNavigation()
    act(() => {
      navigate('NotIdCheck')
    })

    await waitFor(() => {
      const webview = queryByTestId('idcheck-webview')
      expect(webview).toBeFalsy()
      const notWebviewText = getByText('NotIdCheck Page')
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
