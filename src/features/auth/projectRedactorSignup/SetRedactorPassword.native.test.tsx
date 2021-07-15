import React from 'react'
import waitForExpect from 'wait-for-expect'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { goBack } from '__mocks__/@react-navigation/native'
import { SetRedactorPassword } from 'features/auth/projectRedactorSignup/SetRedactorPassword'
import { analytics } from 'libs/analytics'
import { fireEvent, render, waitFor } from 'tests/utils'
import { ColorsEnum } from 'ui/theme'

jest.mock('features/auth/settings')

describe('SetRedactorPassword', () => {
  beforeAll(() => {
    useRoute.mockImplementation(() => ({
      params: {
        email: 'john.doe@example.com',
      },
    }))
  })
  it('should enable the submit button when password is correct', async () => {
    const { getByPlaceholderText, getByTestId } = renderChoosePassword()

    const continueButton = getByTestId('Continuer')

    const background = continueButton.props.style.backgroundColor
    expect(background).toEqual(ColorsEnum.GREY_LIGHT)

    const passwordInput = getByPlaceholderText('Votre mot de passe')

    fireEvent.changeText(passwordInput, 'user@AZERTY123')

    await waitFor(async () => {
      const background = continueButton.props.style.backgroundColor
      expect(background).toEqual(ColorsEnum.PRIMARY)
    })
  })

  it('should navigate to AcceptRedactorCgu when submit password', async () => {
    const { getByPlaceholderText, findByText } = renderChoosePassword()

    const passwordInput = getByPlaceholderText('Votre mot de passe')
    fireEvent.changeText(passwordInput, 'user@AZERTY123')

    const continueButton = await findByText('Continuer')
    fireEvent.press(continueButton)

    await waitForExpect(() => {
      expect(navigate).toBeCalledTimes(1)
      expect(navigate).toHaveBeenCalledWith('AcceptRedactorCgu', {
        email: 'john.doe@example.com',
        password: 'user@AZERTY123',
      })
    })
  })

  it('should navigate to previous page when clicking on leftIcon', () => {
    const { getByTestId } = renderChoosePassword()
    const leftIcon = getByTestId('leftIcon')
    fireEvent.press(leftIcon)

    expect(goBack).toBeCalledTimes(1)
  })

  it('should open quit signup modal', () => {
    const { getByTestId, queryByText } = renderChoosePassword()

    const rightIcon = getByTestId('rightIcon')
    fireEvent.press(rightIcon)

    const title = queryByText("Voulez-vous abandonner l'inscription ?")
    expect(title).toBeTruthy()
  })

  it('should display 3 step dots with the second one as current step', () => {
    const { getAllByTestId } = renderChoosePassword()
    const dots = getAllByTestId('dot-icon')
    expect(dots.length).toBe(3)
    expect(dots[1].props.fill).toEqual(ColorsEnum.PRIMARY)
  })

  describe('<SetRedactorPassword /> - Analytics', () => {
    it('should log CancelSignup when clicking on "Abandonner l\'inscription"', () => {
      const { getByTestId, getByText } = renderChoosePassword()

      const rightIcon = getByTestId('rightIcon')
      fireEvent.press(rightIcon)

      const abandonButton = getByText("Abandonner l'inscription")
      fireEvent.press(abandonButton)

      expect(analytics.logCancelSignup).toHaveBeenCalledTimes(1)
      expect(analytics.logCancelSignup).toHaveBeenCalledWith('RedactorPassword')
    })
  })
})

function renderChoosePassword() {
  return render(<SetRedactorPassword />)
}
