import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { SetEmail } from 'features/auth/signup/SetEmail'
import { analytics } from 'libs/analytics'
import { ColorsEnum } from 'ui/theme'

describe('<SetEmail />', () => {
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
    const { getByTestId } = renderPage()

    const leftIcon = getByTestId('leftIcon')
    fireEvent.press(leftIcon)

    expect(navigate).toBeCalledWith('Home', {
      shouldDisplayLoginModal: true,
    })
  })

  it('should display 4 step dots with the first one as current step', () => {
    const { getAllByTestId } = renderPage()
    const dots = getAllByTestId('dot-icon')
    expect(dots.length).toBe(4)
    expect(dots[0].props.fill).toEqual(ColorsEnum.PRIMARY)
  })

  it('should open quit signup modal', () => {
    const { getByTestId, queryByText } = renderPage()

    const rightIcon = getByTestId('rightIcon')
    fireEvent.press(rightIcon)

    const title = queryByText("Es-tu sûr de vouloir abandonner l'inscription ?")
    expect(title).toBeTruthy()
  })

  describe('Email Validation', () => {
    it('should redirect to SetPassword on valid email with email and newsletter params', () => {
      const { getByText, getByPlaceholderText, queryByText } = renderPage()

      const emailInput = getByPlaceholderText('tonadresse@email.com')
      fireEvent.changeText(emailInput, 'john.doe@gmail.com')

      const continueButton = getByText('Continuer')
      fireEvent.press(continueButton)

      expect(navigate).toBeCalledWith('SetPassword', {
        email: 'john.doe@gmail.com',
        isNewsletterChecked: false,
      })

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

  describe('<SetEmail /> - Analytics', () => {
    it('should log SignUp-cancelSignUp when clicking on "Abandonner l\'inscription"', () => {
      const { getByTestId, getByText } = renderPage()

      const rightIcon = getByTestId('rightIcon')
      fireEvent.press(rightIcon)

      const abandonButton = getByText("Abandonner l'inscription")
      fireEvent.press(abandonButton)

      expect(analytics.logCancelSignup).toHaveBeenCalledTimes(1)
      expect(analytics.logCancelSignup).toHaveBeenCalledWith('Email')
    })
  })
})

function renderPage() {
  return render(<SetEmail />)
}
