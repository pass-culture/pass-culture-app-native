import React from 'react'
import { openInbox } from 'react-native-email-link'

import { EmailValidationRemainingResendsResponse } from 'api/gen'
import { contactSupport } from 'features/auth/helpers/contactSupport'
import { openUrl } from 'features/navigation/helpers/openUrl'
import { usePreviousRoute } from 'features/navigation/helpers/usePreviousRoute'
import { analytics } from 'libs/analytics'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen } from 'tests/utils'

import { SignupConfirmationEmailSent } from './SignupConfirmationEmailSent'

const mockUsePreviousRoute = usePreviousRoute as jest.MockedFunction<typeof usePreviousRoute>
jest.mock('features/navigation/helpers/usePreviousRoute')
jest.mock('features/navigation/helpers/openUrl')

const mockedOpenUrl = openUrl as jest.MockedFunction<typeof openUrl>

let mockIsMailAppAvailable = true
jest.mock('features/auth/helpers/useIsMailAppAvailable', () => ({
  useIsMailAppAvailable: jest.fn(() => mockIsMailAppAvailable),
}))

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('<SignupConfirmationEmailSent />', () => {
  beforeEach(() => {
    mockUsePreviousRoute.mockReturnValue({ name: 'SomeScreen', key: 'key' })
    mockServer.getApi<EmailValidationRemainingResendsResponse>(
      '/v1/email_validation_remaining_resends/john.doe%40gmail.com',
      {
        remainingResends: 3,
      }
    )
    mockIsMailAppAvailable = true
  })

  it('should open faq webpage when clicking on consult help support', async () => {
    renderSignupConfirmationEmailSent()
    await screen.findByText('Confirme ton adresse e-mail')

    const consultHelpSupportButton = screen.getByText('Consulter notre centre d’aide')
    await act(async () => fireEvent.press(consultHelpSupportButton))

    expect(analytics.logHelpCenterContactSignupConfirmationEmailSent).toHaveBeenCalledTimes(1)
    expect(mockedOpenUrl).toHaveBeenCalledWith(
      contactSupport.forSignupConfirmationEmailNotReceived.url,
      contactSupport.forSignupConfirmationEmailNotReceived.params,
      true
    )
  })

  it('should open mail app when clicking on check email button', async () => {
    renderSignupConfirmationEmailSent()
    await screen.findByText('Confirme ton adresse e-mail')

    const checkEmailsButton = screen.getByText('Consulter mes e-mails')
    await act(async () => {
      fireEvent.press(checkEmailsButton)
    })

    expect(openInbox).toHaveBeenCalledTimes(1)
  })

  it('should not show the button to open mail if no mail app is available', async () => {
    mockIsMailAppAvailable = false
    renderSignupConfirmationEmailSent()
    await screen.findByText('Confirme ton adresse e-mail')

    const checkEmailsButton = screen.queryByText('Consulter mes e-mails')

    expect(checkEmailsButton).toBeNull()
  })

  it('should log analytics when clicking on check email button', async () => {
    renderSignupConfirmationEmailSent()
    await screen.findByText('Confirme ton adresse e-mail')

    const checkEmailsButton = screen.getByText('Consulter mes e-mails')
    await act(async () => fireEvent.press(checkEmailsButton))

    expect(analytics.logEmailConfirmationConsultEmailClicked).toHaveBeenCalledTimes(1)
  })

  it('should display resend button', async () => {
    renderSignupConfirmationEmailSent()
    await screen.findByText('Confirme ton adresse e-mail')

    expect(screen.getByText('Recevoir un nouveau lien')).toBeOnTheScreen()
  })

  it('should show modal when resend button is pressed', async () => {
    renderSignupConfirmationEmailSent()
    await screen.findByText('Confirme ton adresse e-mail')

    fireEvent.press(screen.getByText('Recevoir un nouveau lien'))

    expect(screen.getByText('Demander un nouveau lien')).toBeOnTheScreen()
  })
})

const renderSignupConfirmationEmailSent = () =>
  render(reactQueryProviderHOC(<SignupConfirmationEmailSent email="john.doe@gmail.com" />))
