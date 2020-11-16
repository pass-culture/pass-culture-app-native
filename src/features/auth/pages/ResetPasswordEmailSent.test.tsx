import { NavigationContainer } from '@react-navigation/native'
import { act, fireEvent, render } from '@testing-library/react-native'
import React from 'react'
import { Linking } from 'react-native'
import { openInbox } from 'react-native-email-link'
import waitForExpect from 'wait-for-expect'

import { HomeStack } from 'features/home/navigation/HomeNavigator'
import { flushAllPromises } from 'tests/utils'

import { ResetPasswordEmailSent } from './ResetPasswordEmailSent'

jest.mock('@react-navigation/native', () => jest.requireActual('@react-navigation/native'))

describe('<ResetPasswordEmailSent />', () => {
  it('should match snapshot', async () => {
    const instance = renderPage()

    await act(async () => {
      await flushAllPromises()
    })

    expect(instance).toMatchSnapshot()
  })

  it('should open mail app when clicking on contact support button', async () => {
    jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(true)

    const { findByText } = renderPage()

    const contactSupportButton = await findByText('Contacter le support')
    fireEvent.press(contactSupportButton)

    await waitForExpect(() => {
      expect(Linking.openURL).toHaveBeenCalledWith('mailto:support@passculture.app')
    })
  })

  it('should open mail app when clicking on check email button', async () => {
    const { findByText } = renderPage()

    const checkEmailsButton = await findByText('Consulter mes e-mails')
    fireEvent.press(checkEmailsButton)

    await waitForExpect(() => {
      expect(openInbox).toHaveBeenCalled()
    })
  })
})

function renderPage() {
  return render(
    <NavigationContainer>
      <HomeStack.Navigator initialRouteName="Home">
        <HomeStack.Screen
          name="ResetPasswordEmailSent"
          component={ResetPasswordEmailSent}
          initialParams={{ email: 'john.doe@gmail.com' }}
        />
      </HomeStack.Navigator>
    </NavigationContainer>
  )
}
