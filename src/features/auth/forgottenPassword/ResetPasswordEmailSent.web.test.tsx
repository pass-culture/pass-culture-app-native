import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { Text } from 'react-native'
import { openInbox } from 'react-native-email-link'
import waitForExpect from 'wait-for-expect'

import { contactSupport } from 'features/auth/support.services'
import { navigateToHome } from 'features/navigation/helpers'
import { RootStackParamList } from 'features/navigation/RootNavigator'
import { analytics } from 'libs/analytics'
import { flushAllPromises, act, fireEvent, render } from 'tests/utils/web'

import { ResetPasswordEmailSent } from './ResetPasswordEmailSent'

// eslint-disable-next-line local-rules/no-allow-console
allowConsole({ error: true })

jest.mock('@react-navigation/native', () => jest.requireActual('@react-navigation/native'))
jest.mock('features/navigation/helpers')

describe('<ResetPasswordEmailSent />', () => {
  it('should match snapshot', async () => {
    const renderAPI = await renderInitialPage('ResetPasswordEmailSent')
    expect(renderAPI).toMatchSnapshot()
  })

  it('should redirect to previous screen when clicking on ArrowPrevious icon', async () => {
    const renderAPI = await renderInitialPage('PreviousScreen')

    await act(async () => {
      navigationRef.current?.navigate('ResetPasswordEmailSent')
    })
    const leftIcon = renderAPI.getByTestId('leftIcon')
    fireEvent.click(leftIcon)

    await waitForExpect(() => {
      expect(renderAPI.queryByText('PreviousScreenText')).toBeTruthy()
    })
  })

  it('should NOT display back button when previous screen is ForgottenPassword', async () => {
    const renderAPI = await renderInitialPage('ForgottenPassword')

    const leftIconButton = renderAPI.queryByTestId('leftIcon')

    await waitForExpect(() => {
      expect(leftIconButton).toBeFalsy()
    })
  })

  it('should redirect to Home when clicking on Close icon', async () => {
    const renderAPI = await renderInitialPage('ResetPasswordEmailSent')

    fireEvent.click(renderAPI.getByTestId('rightIcon'))

    await waitForExpect(() => {
      expect(navigateToHome).toBeCalled()
    })
  })

  it.skip('should open mail app when clicking on contact support button', async () => {
    const renderAPI = await renderInitialPage('ResetPasswordEmailSent')

    const contactSupportButton = renderAPI.getByText('Contacter le support')
    fireEvent.click(contactSupportButton)

    await waitForExpect(() => {
      expect(analytics.logContactSupportResetPasswordEmailSent).toBeCalledTimes(1)
      expect(contactSupport.forResetPasswordEmailNotReceived).toHaveBeenCalledTimes(1)
      expect(contactSupport.forResetPasswordEmailNotReceived).toHaveBeenCalledWith(
        'john.doe@gmail.com'
      )
    })
  })

  it('should open mail app when clicking on check email button', async () => {
    const renderAPI = await renderInitialPage('ResetPasswordEmailSent')

    const checkEmailsButton = renderAPI.getByText('Consulter mes e-mails')
    fireEvent.click(checkEmailsButton)

    await waitForExpect(() => {
      expect(openInbox).toHaveBeenCalled()
    })
  })
})

const navigationRef = React.createRef<NavigationContainerRef>()

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

async function renderInitialPage(initialScreenName: keyof StackParams) {
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
  await act(async () => {
    await flushAllPromises()
  })
  return renderAPI
}
