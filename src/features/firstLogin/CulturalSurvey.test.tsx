import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { act, render, waitFor } from '@testing-library/react-native'
import React from 'react'
import { Text } from 'react-native'

import { RootStackParamList } from 'features/navigation/RootNavigator'

import { CulturalSurvey } from './CulturalSurvey'

jest.mock('@react-navigation/native', () => jest.requireActual('@react-navigation/native'))

describe('<CulturalSurvey />', () => {
  it('should render correctly', async () => {
    const renderAPI = renderCulturalSurveyWithNavigation()
    await waitFor(() => {
      expect(renderAPI).toMatchSnapshot()
    })
  })

  it('should not display webview when navigating to another screen', async () => {
    const renderAPI = renderCulturalSurveyWithNavigation()

    act(() => {
      navigate('Home')
    })

    await waitFor(() => {
      expect(renderAPI.queryByTestId('cultural-survey-webview')).toBeFalsy()
      expect(renderAPI.getByText('Home Page')).toBeTruthy()
    })
  })

  it('should NOT close webview when emitted message is neither "onClose" nor "onSubmit"', async () => {
    const renderAPI = renderCulturalSurveyWithNavigation()

    act(() => {
      const webview = renderAPI.getByTestId('cultural-survey-webview')
      webview.props.onMessage({ nativeEvent: { data: 'Something Else' } })
    })

    await waitFor(() => {
      expect(renderAPI.queryByTestId('cultural-survey-webview')).toBeTruthy()
      expect(renderAPI.queryByText('Home Page')).toBeFalsy()
    })
  })

  it('should close webview when emitted message is "onClose"', async () => {
    const renderAPI = renderCulturalSurveyWithNavigation()

    act(() => {
      const webview = renderAPI.getByTestId('cultural-survey-webview')
      webview.props.onMessage({ nativeEvent: { data: 'onClose' } })
    })

    await waitFor(() => {
      expect(renderAPI.queryByTestId('cultural-survey-webview')).toBeFalsy()
      expect(renderAPI.getByText('Home Page')).toBeTruthy()
    })
  })

  it('should close webview when emitted message is "onSubmit"', async () => {
    const renderAPI = renderCulturalSurveyWithNavigation()

    act(() => {
      const webview = renderAPI.getByTestId('cultural-survey-webview')
      webview.props.onMessage({ nativeEvent: { data: 'onSubmit' } })
    })

    await waitFor(() => {
      expect(renderAPI.queryByTestId('cultural-survey-webview')).toBeFalsy()
      expect(renderAPI.getByText('Home Page')).toBeTruthy()
    })
  })
})

type StackParamList = {
  CulturalSurvey: RootStackParamList['CulturalSurvey']
  Home: undefined
}

const Stack = createStackNavigator<StackParamList>()

const navigationRef = React.createRef<NavigationContainerRef>()

function navigate(name: string) {
  navigationRef.current?.navigate(name)
}

const Home = () => <Text>Home Page</Text>

function renderCulturalSurveyWithNavigation() {
  return render(
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="CulturalSurvey">
        <Stack.Screen name="CulturalSurvey" component={CulturalSurvey} />
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
