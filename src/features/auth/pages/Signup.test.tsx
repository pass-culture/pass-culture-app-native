import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import { useNavigationMock } from '__mocks__/@react-navigation/native'
import { Signup } from 'features/auth/pages/Signup'
import { ColorsEnum } from 'ui/theme'

describe('<Signup />', () => {
  afterEach(() => jest.resetAllMocks())

  it('should display disabled validate button when email input is not filled', async () => {
    const { getByTestId } = renderPage()

    const button = getByTestId('button-container')
    expect(button.props.style.backgroundColor).toEqual(ColorsEnum.PRIMARY_DISABLED)
  })

  it('should enable validate button when email input is filled', async () => {
    const { getByTestId, getByPlaceholderText } = renderPage()

    const emailInput = getByPlaceholderText('tonadresse@email.com')
    fireEvent.changeText(emailInput, 'john.doe@gmail.com')

    const button = getByTestId('button-container')
    expect(button.props.style.backgroundColor).toEqual(ColorsEnum.PRIMARY)
  })

  it('should redirect to SignUpSignInChoiceModal when clicking on ArrowPrevious icon', async () => {
    const { navigate } = useNavigationMock()
    const { getByTestId } = renderPage()

    const leftIcon = getByTestId('leftIcon')
    fireEvent.press(leftIcon)

    expect(navigate).toBeCalledWith('Home', {
      shouldDisplayLoginModal: true,
    })
  })

  describe('Email Validation', () => {
    it('should redirect to ChoosePassword on valid email', () => {
      const { navigate } = useNavigationMock()

      const { getByText, getByPlaceholderText, queryByText } = renderPage()

      const emailInput = getByPlaceholderText('tonadresse@email.com')
      fireEvent.changeText(emailInput, 'john.doe@gmail.com')

      const continueButton = getByText('Continuer')
      fireEvent.press(continueButton)

      expect(navigate).toBeCalledWith('ChoosePassword')
      expect(queryByText("Format de l'e-mail incorrect")).toBeFalsy()
    })
    it('should reject email', () => {
      const { getByText, getByPlaceholderText, queryByText } = renderPage()

      const emailInput = getByPlaceholderText('tonadresse@email.com')
      fireEvent.changeText(emailInput, 'john.doe')

      const continueButton = getByText('Continuer')
      fireEvent.press(continueButton)

      expect(queryByText("Format de l'e-mail incorrect")).toBeTruthy()
    })
  })
})

function renderPage() {
  return render(<Signup />)
}
