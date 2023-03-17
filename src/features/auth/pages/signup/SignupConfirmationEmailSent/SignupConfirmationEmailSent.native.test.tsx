import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'
import { openInbox } from 'react-native-email-link'

import { contactSupport } from 'features/auth/helpers/contactSupport'
import { mockGoBack } from 'features/navigation/__mocks__/useGoBack'
import { usePreviousRoute, navigateToHome, openUrl } from 'features/navigation/helpers'
import { RootStackParamList } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/firebase/analytics'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

import { SignupConfirmationEmailSent } from './SignupConfirmationEmailSent'

const mockUsePreviousRoute = usePreviousRoute as jest.MockedFunction<typeof usePreviousRoute>
jest.mock('features/navigation/helpers')
const mockedOpenUrl = openUrl as jest.MockedFunction<typeof openUrl>

describe('<SignupConfirmationEmailSent />', () => {
  beforeEach(() => {
    mockUsePreviousRoute.mockReturnValue({ name: 'SomeScreen', key: 'key' })
  })

  it('should go back when clicking on left icon of modal header', () => {
    renderPage()

    const leftIconButton = screen.getByTestId('Revenir en arrière')
    fireEvent.press(leftIconButton)

    expect(mockGoBack).toHaveBeenCalledTimes(1)
  })

  it('should NOT display back button when previous screen is AcceptCgu', () => {
    mockUsePreviousRoute.mockReturnValueOnce({ name: 'AcceptCgu', key: 'key' })
    renderPage()

    const leftIconButton = screen.queryByTestId('Revenir en arrière')

    expect(leftIconButton).toBeFalsy()
  })

  it('should go to home page when clicking on right icon', () => {
    renderPage()

    const rightIconButton = screen.getByTestId('Abandonner l’inscription')
    fireEvent.press(rightIconButton)

    expect(navigateToHome).toBeCalledTimes(1)
  })

  it('should open faq webpage when clicking on consult help support', async () => {
    renderPage()

    const consultHelpSupportButton = screen.getByText('Consulter notre centre d’aide')
    fireEvent.press(consultHelpSupportButton)

    await waitFor(() => {
      expect(analytics.logHelpCenterContactSignupConfirmationEmailSent).toBeCalledTimes(1)
      expect(mockedOpenUrl).toBeCalledWith(
        contactSupport.forSignupConfirmationEmailNotReceived.url,
        contactSupport.forSignupConfirmationEmailNotReceived.params,
        true
      )
    })
  })

  it('should open mail app when clicking on check email button', () => {
    renderPage()

    const checkEmailsButton = screen.getByText('Consulter mes e-mails')
    fireEvent.press(checkEmailsButton)

    expect(openInbox).toHaveBeenCalledTimes(1)
  })
})

function renderPage() {
  const navigationProps = {
    route: { params: { email: 'john.doe@gmail.com' } },
  } as StackScreenProps<RootStackParamList, 'SignupConfirmationEmailSent'>
  return render(<SignupConfirmationEmailSent {...navigationProps} />)
}
