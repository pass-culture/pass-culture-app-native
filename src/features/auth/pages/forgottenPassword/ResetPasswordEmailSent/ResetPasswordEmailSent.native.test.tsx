import { RouteProp } from '@react-navigation/native'
import React from 'react'
import { openInbox } from 'react-native-email-link'

import { navigate } from '__mocks__/@react-navigation/native'
import { RootStackParamList } from 'features/navigation/RootNavigator/types'
import { fireEvent, render, screen } from 'tests/utils'

import { ResetPasswordEmailSent } from './ResetPasswordEmailSent'

jest.mock('features/navigation/helpers')
jest.mock('features/auth/helpers/useIsMailAppAvailableIOS', () => ({
  useIsMailAppAvailableIOS: jest.fn(() => true),
}))

const routeMock: RouteProp<RootStackParamList, 'ResetPasswordEmailSent'> = {
  key: 'ResetPasswordEmailSent',
  name: 'ResetPasswordEmailSent',
  params: { email: 'john.doe@gmail.com' },
}

describe('<ResetPasswordEmailSent />', () => {
  it('should match snapshot', () => {
    render(<ResetPasswordEmailSent route={routeMock} />)

    expect(screen).toMatchSnapshot()
  })

  it('should redirect to Login when clicking on "Quitter" button', async () => {
    render(<ResetPasswordEmailSent route={routeMock} />)

    const quitButton = await screen.findByText('Quitter')
    fireEvent.press(quitButton)

    expect(navigate).toHaveBeenCalledWith('Login', undefined)
  })

  it('should open mail app when clicking on check email button', async () => {
    render(<ResetPasswordEmailSent route={routeMock} />)

    const checkEmailsButton = await screen.findByText('Consulter mes e-mails')
    fireEvent.press(checkEmailsButton)

    expect(openInbox).toHaveBeenCalledTimes(1)
  })
})
