import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { Text } from 'react-native'
import { openInbox } from 'react-native-email-link'

import { navigateToHome } from 'features/navigation/helpers'
import { RootStackParamList } from 'features/navigation/RootNavigator/types'
import { act, fireEvent, render, screen } from 'tests/utils'

import { ResetPasswordEmailSent } from './ResetPasswordEmailSent'

jest.mock('@react-navigation/native', () => jest.requireActual('@react-navigation/native'))
jest.mock('@react-navigation/stack', () => jest.requireActual('@react-navigation/stack'))
jest.mock('features/navigation/helpers')

describe('<ResetPasswordEmailSent />', () => {
  it('should match snapshot', () => {
    renderInitialPage('ResetPasswordEmailSent')

    expect(screen).toMatchSnapshot()
  })

  it('should redirect to previous screen when clicking on ArrowPrevious icon', () => {
    renderInitialPage('PreviousScreen')
    act(() => navigationRef.navigate('ResetPasswordEmailSent', { email: '' }))

    fireEvent.press(screen.getByLabelText('Revenir en arrière'))

    expect(screen.getByText('PreviousScreenText')).toBeTruthy()
  })

  it('should NOT display back button when previous screen is ForgottenPassword', () => {
    renderInitialPage('ForgottenPassword')

    const leftIconButton = screen.queryByTestId('Revenir en arrière')
    expect(leftIconButton).toBeFalsy()
  })

  it('should redirect to Home when clicking on Close icon', () => {
    renderInitialPage('ResetPasswordEmailSent')

    fireEvent.press(screen.getByTestId('Revenir à l’accueil'))

    expect(navigateToHome).toHaveBeenCalledTimes(1)
  })

  it('should open mail app when clicking on check email button', () => {
    renderInitialPage('ResetPasswordEmailSent')

    const checkEmailsButton = screen.getByText('Consulter mes e-mails')
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
