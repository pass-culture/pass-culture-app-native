import { StackScreenProps } from '@react-navigation/stack'
import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'
import waitForExpect from 'wait-for-expect'

import { ForgottenPassword } from 'features/auth/pages/ForgottenPassword'
import { HomeStackParamList } from 'features/home/navigation/HomeNavigator'
import { navigationTestProps } from 'tests/navigation'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.mock('@react-navigation/native', () => jest.requireActual('@react-navigation/native'))

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
    const { getByPlaceholderText, findByText } = renderPage()

    const emailInput = getByPlaceholderText('tonadresse@email.com')
    fireEvent.changeText(emailInput, 'john.doe@gmail.com')

    const validateEmailButton = await findByText('Valider')
    fireEvent.press(validateEmailButton)

    await waitForExpect(() => {
      expect(navigationTestProps.navigation.navigate).toBeCalledTimes(1)
      expect(navigationTestProps.navigation.navigate).toHaveBeenCalledWith(
        'ResetPasswordEmailSent',
        {
          email: 'john.doe@gmail.com',
        }
      )
    })
  })

  it('should redirect to Login when clicking on ArrowPrevious icon', async () => {
    const { getByTestId } = renderPage()

    const leftIcon = getByTestId('leftIcon')
    fireEvent.press(leftIcon)

    await waitForExpect(() => {
      expect(navigationTestProps.navigation.navigate).toBeCalledTimes(1)
      expect(navigationTestProps.navigation.navigate).toHaveBeenCalledWith('Login')
    })
  })
})

function renderPage() {
  return render(
    <ForgottenPassword
      {...(navigationTestProps as StackScreenProps<HomeStackParamList, 'ForgottenPassword'>)}
    />
  )
}
