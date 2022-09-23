import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'
import { openInbox } from 'react-native-email-link'
import waitForExpect from 'wait-for-expect'

import { contactSupport } from 'features/auth/support.services'
import { mockGoBack } from 'features/navigation/__mocks__/useGoBack'
import { usePreviousRoute, navigateToHome, openUrl } from 'features/navigation/helpers'
import { RootStackParamList } from 'features/navigation/RootNavigator'
import { analytics } from 'libs/firebase/analytics'
import { fireEvent, render } from 'tests/utils'

import { SignupConfirmationEmailSent } from '../../SignupConfirmationEmailSent/SignupConfirmationEmailSent'

const mockUsePreviousRoute = usePreviousRoute as jest.MockedFunction<typeof usePreviousRoute>
jest.mock('features/navigation/helpers')
const mockedOpenUrl = openUrl as jest.MockedFunction<typeof openUrl>

describe('<SignupConfirmationEmailSent />', () => {
  beforeEach(() => {
    mockUsePreviousRoute.mockReturnValue({ name: 'SomeScreen', key: 'key' })
  })

  it('should go back when clicking on left icon of modal header', async () => {
    const { findByTestId } = renderPage()

    const leftIconButton = await findByTestId('Revenir en arrière')
    fireEvent.press(leftIconButton)

    await waitForExpect(() => {
      expect(mockGoBack).toHaveBeenCalledTimes(1)
    })
  })

  it('should NOT display back button when previous screen is AcceptCgu', async () => {
    // eslint-disable-next-line local-rules/independant-mocks
    mockUsePreviousRoute.mockReturnValue({ name: 'AcceptCgu', key: 'key' })
    const { queryByTestId } = renderPage()

    const leftIconButton = queryByTestId('Revenir en arrière')

    await waitForExpect(() => {
      expect(leftIconButton).toBeFalsy()
    })
  })

  it('should go to home page when clicking on right icon', async () => {
    const { findByTestId } = renderPage()

    const rightIconButton = await findByTestId('Abandonner l’inscription')
    fireEvent.press(rightIconButton)

    await waitForExpect(() => {
      expect(navigateToHome).toBeCalledTimes(1)
    })
  })

  it('should open faq webpage when clicking on consult help support', async () => {
    const { findByText } = renderPage()

    const consultHelpSupportButton = await findByText('Consulter notre centre d’aide')
    fireEvent.press(consultHelpSupportButton)

    await waitForExpect(() => {
      expect(analytics.logHelpCenterContactSignupConfirmationEmailSent).toBeCalledTimes(1)
      expect(mockedOpenUrl).toBeCalledWith(
        contactSupport.forSignupConfirmationEmailNotReceived.url,
        contactSupport.forSignupConfirmationEmailNotReceived.params
      )
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
  const navigationProps = {
    route: { params: { email: 'john.doe@gmail.com' } },
  } as StackScreenProps<RootStackParamList, 'SignupConfirmationEmailSent'>
  return render(<SignupConfirmationEmailSent {...navigationProps} />)
}
