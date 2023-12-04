import React from 'react'
import { openInbox } from 'react-native-email-link'

import { contactSupport } from 'features/auth/helpers/contactSupport'
import { usePreviousRoute, openUrl } from 'features/navigation/helpers'
import { analytics } from 'libs/analytics'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen } from 'tests/utils'

import { SignupConfirmationEmailSent } from './SignupConfirmationEmailSent'

const mockUsePreviousRoute = usePreviousRoute as jest.MockedFunction<typeof usePreviousRoute>
jest.mock('features/navigation/helpers')
const mockedOpenUrl = openUrl as jest.MockedFunction<typeof openUrl>

const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(true)

let mockIsMailAppAvailable = true
jest.mock('features/auth/helpers/useIsMailAppAvailableIOS', () => ({
  useIsMailAppAvailableIOS: jest.fn(() => mockIsMailAppAvailable),
}))

describe('<SignupConfirmationEmailSent />', () => {
  beforeEach(() => {
    mockUsePreviousRoute.mockReturnValue({ name: 'SomeScreen', key: 'key' })
    mockServer.getApiV1('/email_validation_remaining_resends/john.doe%40gmail.com', {
      remainingResends: 3,
    })
  })

  it('should open faq webpage when clicking on consult help support', async () => {
    renderSignupConfirmationEmailSent()

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

    const checkEmailsButton = screen.getByText('Consulter mes e-mails')
    await act(async () => {
      fireEvent.press(checkEmailsButton)
    })

    expect(openInbox).toHaveBeenCalledTimes(1)
  })

  it('should not show the button to open mail if no mail app is available', async () => {
    mockIsMailAppAvailable = false
    renderSignupConfirmationEmailSent()
    await act(async () => {})

    const checkEmailsButton = screen.queryByText('Consulter mes e-mails')

    expect(checkEmailsButton).toBeNull()
  })

  it('should log analytics when clicking on check email button', async () => {
    mockIsMailAppAvailable = true
    renderSignupConfirmationEmailSent()
    const checkEmailsButton = screen.getByText('Consulter mes e-mails')
    await act(async () => fireEvent.press(checkEmailsButton))

    expect(analytics.logEmailConfirmationConsultEmailClicked).toHaveBeenCalledTimes(1)
  })

  it('should display resend button when feature flag is active', async () => {
    renderSignupConfirmationEmailSent()
    await act(async () => {})

    expect(screen.getByText('Recevoir un nouveau lien')).toBeOnTheScreen()
  })

  it('should hide resend button when feature flag is disabled', async () => {
    useFeatureFlagSpy.mockReturnValueOnce(false)
    renderSignupConfirmationEmailSent()
    await act(async () => {})

    expect(screen.queryByText('Recevoir un nouveau lien')).not.toBeOnTheScreen()
  })

  it('should show modal when resend button is pressed', async () => {
    renderSignupConfirmationEmailSent()

    await act(async () => {
      fireEvent.press(screen.getByText('Recevoir un nouveau lien'))
    })

    expect(screen.getByText('Demander un nouveau lien')).toBeOnTheScreen()
  })
})

const renderSignupConfirmationEmailSent = () =>
  render(reactQueryProviderHOC(<SignupConfirmationEmailSent email="john.doe@gmail.com" />))
