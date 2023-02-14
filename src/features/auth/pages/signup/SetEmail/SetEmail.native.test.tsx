import React from 'react'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { analytics } from 'libs/firebase/analytics'
import { act, fireEvent, render } from 'tests/utils'
import { SUGGESTION_DELAY_IN_MS } from 'ui/components/inputs/EmailInputWithSpellingHelp/useEmailSpellingHelp'

import { SetEmail } from './SetEmail'

const props = {
  goToNextStep: jest.fn(),
  signUp: jest.fn(),
}

jest.useFakeTimers()

describe('<SetEmail />', () => {
  it('should display disabled validate button when email input is not filled', () => {
    const { getByText } = render(<SetEmail {...props} />)

    const button = getByText('Continuer')
    expect(button).toBeDisabled()
  })

  it('should display disabled validate button when email input is filled spaces', async () => {
    const { getByText, getByPlaceholderText } = render(<SetEmail {...props} />)

    await act(async () => {
      const emailInput = getByPlaceholderText('tonadresse@email.com')
      fireEvent.changeText(emailInput, '    ')
    })

    const button = getByText('Continuer')
    expect(button).toBeDisabled()
  })

  it('should display disabled validate button when email input is filled', async () => {
    const { getByText, getByPlaceholderText } = render(<SetEmail {...props} />)

    await act(async () => {
      const emailInput = getByPlaceholderText('tonadresse@email.com')
      fireEvent.changeText(emailInput, 'john.doe@gmail.com')
    })

    const button = getByText('Continuer')
    expect(button).toBeEnabled()
  })

  it('should enable validate button when email input is filled', async () => {
    const { getByText, getByPlaceholderText } = render(<SetEmail {...props} />)

    await act(async () => {
      const emailInput = getByPlaceholderText('tonadresse@email.com')
      fireEvent.changeText(emailInput, 'john.doe@gmail.com')
    })

    const button = getByText('Continuer')
    expect(button).toBeEnabled()
  })

  it('should call goToNextStep() on valid email with email and newsletter params', async () => {
    const { getByText, getByPlaceholderText } = render(<SetEmail {...props} />)

    await act(async () => {
      const emailInput = getByPlaceholderText('tonadresse@email.com')
      fireEvent.changeText(emailInput, 'john.doe@gmail.com')
    })

    await act(async () => {
      const continueButton = getByText('Continuer')
      fireEvent.press(continueButton)
    })

    expect(props.goToNextStep).toBeCalledWith({
      email: 'john.doe@gmail.com',
      marketingEmailSubscription: false,
    })
  })

  it('should not display email help message by default', async () => {
    const { getByText, getByPlaceholderText, queryByText } = render(<SetEmail {...props} />)

    await act(async () => {
      const emailInput = getByPlaceholderText('tonadresse@email.com')
      fireEvent.changeText(emailInput, 'john.doe@gmail.com')

      const continueButton = getByText('Continuer')
      fireEvent.press(continueButton)
    })

    expect(
      queryByText(
        'L’e-mail renseigné est incorrect. Exemple de format attendu\u00a0: edith.piaf@email.fr'
      )
    ).toBeFalsy()
  })

  it('should reject email when trying to submit', async () => {
    const { getByText, getByPlaceholderText, queryByText } = render(<SetEmail {...props} />)

    await act(async () => {
      const emailInput = getByPlaceholderText('tonadresse@email.com')
      fireEvent.changeText(emailInput, 'john.doe')
    })

    await act(async () => {
      const continueButton = getByText('Continuer')
      fireEvent.press(continueButton)
    })

    expect(
      queryByText(
        'L’e-mail renseigné est incorrect. Exemple de format attendu : edith.piaf@email.fr'
      )
    ).toBeTruthy()
  })

  it('should log analytics when clicking on "Se connecter" button', async () => {
    const { getByText } = render(<SetEmail {...props} />)

    await act(async () => {
      const loginButton = getByText('Se connecter')
      fireEvent.press(loginButton)
    })

    expect(analytics.logLogin).toHaveBeenNthCalledWith(1, { method: 'fromSetEmail' })
  })

  it('should display suggestion with a corrected email when the email is mistyped', async () => {
    const { getByPlaceholderText, queryByText } = render(<SetEmail {...props} />)

    await act(async () => {
      const emailInput = getByPlaceholderText('tonadresse@email.com')
      fireEvent.changeText(emailInput, 'john.doe@gmal.com')
    })

    await act(async () => {
      jest.advanceTimersByTime(SUGGESTION_DELAY_IN_MS)
    })

    expect(queryByText('Veux-tu plutôt dire john.doe@gmail.com\u00a0?')).toBeTruthy()
  })

  it('should log analytics when user select the suggested email', async () => {
    const { getByText, getByPlaceholderText } = render(<SetEmail {...props} />)

    await act(async () => {
      const emailInput = getByPlaceholderText('tonadresse@email.com')
      fireEvent.changeText(emailInput, 'john.doe@gmal.com')
    })

    await act(async () => {
      jest.advanceTimersByTime(SUGGESTION_DELAY_IN_MS)
    })

    const suggestionButton = getByText('Appliquer la modification')
    fireEvent.press(suggestionButton)

    expect(analytics.logHasCorrectedEmail).toHaveBeenNthCalledWith(1, { from: 'setemail' })
  })

  it('should navigate to Login with provided offerId when clicking on "Se connecter" button', async () => {
    const OFFER_ID = 1
    useRoute.mockReturnValueOnce({ params: { offerId: OFFER_ID } })
    const { getByText } = render(<SetEmail {...props} />)

    await act(async () => {
      const loginButton = getByText('Se connecter')
      fireEvent.press(loginButton)
    })

    expect(navigate).toHaveBeenNthCalledWith(1, 'Login', {
      preventCancellation: true,
      offerId: OFFER_ID,
    })
  })
})
