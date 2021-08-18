import React from 'react'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { SetRedactorEmail } from 'features/auth/projectRedactorSignup/SetRedactorEmail'
import { analytics } from 'libs/analytics'
import { fireEvent, render } from 'tests/utils'
import { ColorsEnum } from 'ui/theme'

describe('<SetRedactorEmail />', () => {
  beforeEach(() =>
    useRoute.mockImplementation(() => ({
      params: {},
    }))
  )
  afterEach(() => jest.resetAllMocks())

  it('should display disabled validate button when email input is not filled', () => {
    const { getByTestId } = renderPage()

    const button = getByTestId('Continuer')
    expect(button.props.style.backgroundColor).toEqual(ColorsEnum.GREY_LIGHT)
  })

  it('should enable validate button when email input is filled', () => {
    const { getByTestId, getByPlaceholderText } = renderPage()

    const emailInput = getByPlaceholderText('votreadresse@email.com')
    fireEvent.changeText(emailInput, 'john.doe@gmail.com')

    const button = getByTestId('Continuer')
    expect(button.props.style.backgroundColor).toEqual(ColorsEnum.PRIMARY)
  })

  it('should display 3 step dots with the first one as current step', () => {
    const { getAllByTestId } = renderPage()
    const dots = getAllByTestId('dot-icon')
    expect(dots.length).toBe(3)
    expect(dots[0].props.fill).toEqual(ColorsEnum.PRIMARY)
  })

  it('should open quit signup modal', () => {
    const { getByTestId, queryByText } = renderPage()

    const rightIcon = getByTestId('rightIcon')
    fireEvent.press(rightIcon)

    const title = queryByText("Voulez-vous abandonner l'inscription ?")
    expect(title).toBeTruthy()
  })

  describe('Email Validation', () => {
    it('should redirect to SetPassword on valid email with email', () => {
      const { getByText, getByPlaceholderText, queryByText } = renderPage()

      const emailInput = getByPlaceholderText('votreadresse@email.com')
      fireEvent.changeText(emailInput, 'john.doe@gmail.com')

      const continueButton = getByText('Continuer')
      fireEvent.press(continueButton)

      expect(navigate).toBeCalledWith('SetRedactorPassword', {
        email: 'john.doe@gmail.com',
      })

      expect(queryByText("Format de l'e-mail incorrect")).toBeFalsy()
    })

    it('should reject email', () => {
      const { getByText, getByPlaceholderText, queryByText } = renderPage()

      const emailInput = getByPlaceholderText('votreadresse@email.com')
      fireEvent.changeText(emailInput, 'john.doe')

      const continueButton = getByText('Continuer')
      fireEvent.press(continueButton)

      expect(queryByText("Format de l'e-mail incorrect")).toBeTruthy()
    })
  })

  describe('<SetEmail /> - Analytics', () => {
    it('should log CancelSignup when clicking on "Abandonner l\'inscription"', () => {
      const { getByTestId, getByText } = renderPage()

      const rightIcon = getByTestId('rightIcon')
      fireEvent.press(rightIcon)

      const abandonButton = getByText("Abandonner l'inscription")
      fireEvent.press(abandonButton)

      expect(analytics.logCancelSignup).toHaveBeenCalledTimes(1)
      expect(analytics.logCancelSignup).toHaveBeenCalledWith('RedactorEmail')
    })
  })
})

function renderPage() {
  return render(<SetRedactorEmail />)
}
