import React from 'react'
import { openInbox } from 'react-native-email-link'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import waitForExpect from 'wait-for-expect'

import { goBack, useRoute } from '__mocks__/@react-navigation/native'
import { RedactorSignupConfirmationEmailSent } from 'features/auth/projectRedactorSignup/RedactorSignupConfirmationEmailSent'
import { contactSupport } from 'features/auth/support.services'
import { navigateToHome } from 'features/navigation/helpers'
import { analytics } from 'libs/analytics'
import { fireEvent, render } from 'tests/utils/web'

jest.mock('features/navigation/helpers')

describe('<RedactorSignupConfirmationEmailSent />', () => {
  beforeAll(() => {
    useRoute.mockImplementation(() => ({
      params: {
        email: 'john.doe@example.com',
      },
    }))
  })
  it('should go back when clicking on left icon of modal header', async () => {
    const { findByTestId } = renderPage()

    const leftIconButton = await findByTestId('leftIcon')
    fireEvent.click(leftIconButton)

    await waitForExpect(() => {
      expect(goBack).toHaveBeenCalledTimes(1)
    })
  })

  it('should go to home page when clicking on right icon', async () => {
    const { findByTestId } = renderPage()

    const rightIconButton = await findByTestId('rightIconButton')
    fireEvent.click(rightIconButton)

    await waitForExpect(() => {
      expect(navigateToHome).toBeCalledTimes(1)
    })
  })

  it('should open faq webpage when clicking on consult help support', async () => {
    const { findByText } = renderPage()

    const consultHelpSupportButton = await findByText("Consulter notre centre d'aide")
    fireEvent.click(consultHelpSupportButton)

    await waitForExpect(() => {
      expect(analytics.logHelpCenterContactSignupConfirmationEmailSent).toBeCalledTimes(1)
      expect(contactSupport.forSignupConfirmationEmailNotReceived).toBeCalledTimes(1)
    })
  })

  it('should open mail app when clicking on check email button', async () => {
    const { findByText } = renderPage()

    const checkEmailsButton = await findByText('Consulter mes e-mails')
    fireEvent.click(checkEmailsButton)

    await waitForExpect(() => {
      expect(openInbox).toHaveBeenCalled()
    })
  })
})

function renderPage() {
  return render(
    <SafeAreaProvider>
      <RedactorSignupConfirmationEmailSent />
    </SafeAreaProvider>
  )
}
