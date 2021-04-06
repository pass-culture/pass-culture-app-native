import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'
import { openInbox } from 'react-native-email-link'
import waitForExpect from 'wait-for-expect'

import { navigate, goBack } from '__mocks__/@react-navigation/native'
import * as NavigationHelpers from 'features/navigation/helpers'
import { RootStackParamList } from 'features/navigation/RootNavigator'
import { analytics } from 'libs/analytics'
import { fireEvent, render } from 'tests/utils'

import { contactSupport } from '../support.services'

import { SignupConfirmationEmailSent } from './SignupConfirmationEmailSent'

const mockUsePreviousRoute = NavigationHelpers.usePreviousRoute as jest.MockedFunction<
  typeof NavigationHelpers.usePreviousRoute
>
type MockNavigationHelpers = typeof NavigationHelpers
jest.mock('features/navigation/helpers', () => ({
  ...jest.requireActual<MockNavigationHelpers>('../../navigation/helpers'),
  usePreviousRoute: jest.fn(),
}))

describe('<SignupConfirmationEmailSent />', () => {
  beforeEach(() => {
    mockUsePreviousRoute.mockReturnValue({ name: 'SomeScreen', key: 'key' })
  })

  it('should go back when clicking on left icon of modal header', async () => {
    const { findByTestId } = renderPage()

    const leftIconButton = await findByTestId('leftIcon')
    fireEvent.press(leftIconButton)

    await waitForExpect(() => {
      expect(goBack).toHaveBeenCalledTimes(1)
    })
  })

  it('should NOT display back button when previous screen is AcceptCgu', async () => {
    mockUsePreviousRoute.mockReturnValue({ name: 'AcceptCgu', key: 'key' })
    const { queryByTestId } = renderPage()

    const leftIconButton = queryByTestId('leftIcon')

    await waitForExpect(() => {
      expect(leftIconButton).toBeFalsy()
    })
  })

  it('should go to home page when clicking on right icon', async () => {
    const { findByTestId } = renderPage()

    const rightIconButton = await findByTestId('rightIconButton')
    fireEvent.press(rightIconButton)

    await waitForExpect(() => {
      expect(navigate).toHaveBeenCalledTimes(1)
      expect(navigate).toHaveBeenCalledWith('Home', { shouldDisplayLoginModal: false })
    })
  })

  it('should open mail app when clicking on contact support button', async () => {
    const { findByText } = renderPage()

    const contactSupportButton = await findByText('Contacter le support')
    fireEvent.press(contactSupportButton)

    await waitForExpect(() => {
      expect(analytics.logContactSupportSignupConfirmationEmailSent).toBeCalledTimes(1)
      expect(contactSupport.forSignupConfirmationEmailNotReceived).toBeCalledTimes(1)
      expect(contactSupport.forSignupConfirmationEmailNotReceived).toBeCalledWith(
        'john.doe@gmail.com'
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
