import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { Text } from 'react-native'
import { openInbox } from 'react-native-email-link'

import { navigateToHome } from 'features/navigation/helpers'
import { RootStackParamList } from 'features/navigation/RootNavigator/types'
import { act, fireEvent, render } from 'tests/utils'

import { ResetPasswordEmailSent } from './ResetPasswordEmailSent'

jest.mock('@react-navigation/native', () => jest.requireActual('@react-navigation/native'))
jest.mock('@react-navigation/stack', () => jest.requireActual('@react-navigation/stack'))
jest.mock('features/navigation/helpers')

describe('<ResetPasswordEmailSent />', () => {
  it('should match snapshot', async () => {
    const renderAPI = renderInitialPage('ResetPasswordEmailSent')
    expect(renderAPI).toMatchSnapshot()
  })

  it('should redirect to previous screen when clicking on ArrowPrevious icon', async () => {
    const { getByLabelText, getByText } = renderInitialPage('PreviousScreen')

    await act(async () => {
      navigationRef.navigate('ResetPasswordEmailSent', { email: '' })
    })

    fireEvent.press(getByLabelText('Revenir en arrière'))

    expect(getByText('PreviousScreenText')).toBeTruthy()
  })

  it('should NOT display back button when previous screen is ForgottenPassword', () => {
    const { queryByTestId } = renderInitialPage('ForgottenPassword')

    const leftIconButton = queryByTestId('Revenir en arrière')

    expect(leftIconButton).toBeFalsy()
  })

  it('should redirect to Home when clicking on Close icon', () => {
    const { getByTestId } = renderInitialPage('ResetPasswordEmailSent')

    fireEvent.press(getByTestId('Revenir à l’accueil'))

    expect(navigateToHome).toHaveBeenCalledTimes(1)
  })

  it('should open mail app when clicking on check email button', () => {
    const { getByText } = renderInitialPage('ResetPasswordEmailSent')

    const checkEmailsButton = getByText('Consulter mes e-mails')
    fireEvent.press(checkEmailsButton)

    expect(openInbox).toHaveBeenCalledTimes(1)
  })
})

const navigationRef = createNavigationContainerRef<StackParams>()

type StackParams = {
  ForgottenPassword: RootStackParamList['ForgottenPassword']
  Home: undefined
  PreviousScreen: undefined
  ResetPasswordEmailSent: { email: string }
}

const TestStack = createStackNavigator<StackParams>()

const Home = () => <Text>HomeText</Text>
const PreviousScreen = () => <Text>PreviousScreenText</Text>
const ForgottenPassword = () => <Text>ForgottenPasswordScreenText</Text>

function renderInitialPage(initialScreenName: keyof StackParams) {
  const renderAPI = render(
    <NavigationContainer ref={navigationRef}>
      <TestStack.Navigator initialRouteName={initialScreenName}>
        <TestStack.Screen name="Home" component={Home} />
        <TestStack.Screen name="PreviousScreen" component={PreviousScreen} />
        <TestStack.Screen name="ForgottenPassword" component={ForgottenPassword} />
        <TestStack.Screen
          name="ResetPasswordEmailSent"
          component={ResetPasswordEmailSent}
          initialParams={{ email: 'john.doe@gmail.com' }}
        />
      </TestStack.Navigator>
    </NavigationContainer>
  )
  return renderAPI
}
