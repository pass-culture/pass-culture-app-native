import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import { openInbox } from 'react-native-email-link'

import { mockGoBack } from 'features/navigation/__mocks__/useGoBack'
import { navigateToHome } from 'features/navigation/helpers'
import { RootStackParamList } from 'features/navigation/RootNavigator/types'
import { fireEvent, render, screen } from 'tests/utils'

import { ResetPasswordEmailSent } from './ResetPasswordEmailSent'

jest.mock('features/navigation/helpers')

const routeMock: RouteProp<RootStackParamList, 'ResetPasswordEmailSent'> = {
  key: 'ResetPasswordEmailSent',
  name: 'ResetPasswordEmailSent',
  params: { email: 'john.doe@gmail.com' },
}

const navigationMock: StackNavigationProp<RootStackParamList, 'ResetPasswordEmailSent', undefined> =
  {
    navigate: jest.fn(),
    goBack: jest.fn(),
    isFocused: jest.fn(),
    dispatch: jest.fn(),
    reset: jest.fn(),
    canGoBack: jest.fn(),
    getId: jest.fn(),
    getState: jest.fn(),
    getParent: jest.fn(),
    setParams: jest.fn(),
    setOptions: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    replace: jest.fn(),
    push: jest.fn(),
    pop: jest.fn(),
    popToTop: jest.fn(),
  }
describe('<ResetPasswordEmailSent />', () => {
  it('should match snapshot', () => {
    render(<ResetPasswordEmailSent route={routeMock} navigation={navigationMock} />)

    expect(screen).toMatchSnapshot()
  })

  it('should redirect to previous screen when clicking on ArrowPrevious icon', async () => {
    render(<ResetPasswordEmailSent route={routeMock} navigation={navigationMock} />)

    fireEvent.press(screen.getByLabelText('Revenir en arrière'))

    expect(mockGoBack).toHaveBeenCalledTimes(1)
  })

  it('should redirect to Home when clicking on Close icon', async () => {
    render(<ResetPasswordEmailSent route={routeMock} navigation={navigationMock} />)

    fireEvent.press(await screen.findByLabelText('Revenir à l’accueil'))

    expect(navigateToHome).toHaveBeenCalledTimes(1)
  })

  it('should open mail app when clicking on check email button', async () => {
    render(<ResetPasswordEmailSent route={routeMock} navigation={navigationMock} />)

    const checkEmailsButton = await screen.findByText('Consulter mes e-mails')
    fireEvent.press(checkEmailsButton)

    expect(openInbox).toHaveBeenCalledTimes(1)
  })
})
