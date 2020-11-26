import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'
import waitForExpect from 'wait-for-expect'

import { useNavigationMock } from '__mocks__/@react-navigation/native'
import { ForgottenPassword } from 'features/auth/pages/ForgottenPassword'

beforeEach(() => {
  jest.resetAllMocks()
})

describe('<ForgottenPassword />', () => {
  it('should enable validate button when email input is filled', async () => {
    const { getByPlaceholderText, toJSON } = renderPage()
    const disabledButtonSnapshot = toJSON()

    const emailInput = getByPlaceholderText('tonadresse@email.com')
    fireEvent.changeText(emailInput, 'john.doe@gmail.com')

    await waitForExpect(() => {
      const enabledButtonSnapshot = toJSON()
      expect(disabledButtonSnapshot).toMatchDiffSnapshot(enabledButtonSnapshot)
    })
  })

  it('should redirect to ResetPasswordEmailSent when password reset request is successful', async () => {
    const { navigate } = useNavigationMock()
    const { getByPlaceholderText, findByText } = renderPage()

    const emailInput = getByPlaceholderText('tonadresse@email.com')
    fireEvent.changeText(emailInput, 'john.doe@gmail.com')

    const validateEmailButton = await findByText('Valider')
    fireEvent.press(validateEmailButton)

    await waitForExpect(() => {
      expect(navigate).toBeCalledTimes(1)
      expect(navigate).toHaveBeenCalledWith('ResetPasswordEmailSent', {
        email: 'john.doe@gmail.com',
      })
    })
  })

  it('should redirect to Login when clicking on ArrowPrevious icon', async () => {
    const { navigate } = useNavigationMock()
    const { getByTestId } = renderPage()

    const leftIcon = getByTestId('leftIcon')
    fireEvent.press(leftIcon)

    await waitForExpect(() => {
      expect(navigate).toBeCalledTimes(1)
      expect(navigate).toHaveBeenCalledWith('Login')
    })
  })
})

function renderPage() {
  return render(<ForgottenPassword />)
}
