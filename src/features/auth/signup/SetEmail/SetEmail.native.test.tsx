import React from 'react'

import { SetEmail } from 'features/auth/signup/SetEmail'
import { analytics } from 'libs/firebase/analytics'
import { act, fireEvent, render } from 'tests/utils'

const props = { goToNextStep: jest.fn(), signUp: jest.fn() }

describe('<SetEmail />', () => {
  it('should display disabled validate button when email input is not filled', () => {
    const { getByText } = render(<SetEmail {...props} />)

    const button = getByText('Continuer')
    expect(button).toBeDisabled()
  })

  it('should enable validate button when email input is filled', async () => {
    const { getByText, getByPlaceholderText } = render(<SetEmail {...props} />)

    const emailInput = getByPlaceholderText('tonadresse@email.com')
    await act(async () => await fireEvent.changeText(emailInput, 'john.doe@gmail.com'))

    const button = getByText('Continuer')
    expect(button).toBeEnabled()
  })

  it('should call goToNextStep() on valid email with email and newsletter params', async () => {
    const { getByText, getByPlaceholderText } = render(<SetEmail {...props} />)

    const emailInput = getByPlaceholderText('tonadresse@email.com')
    await act(async () => await fireEvent.changeText(emailInput, 'john.doe@gmail.com'))

    const continueButton = getByText('Continuer')
    await act(async () => await fireEvent.press(continueButton))

    expect(props.goToNextStep).toBeCalledWith({
      email: 'john.doe@gmail.com',
      marketingEmailSubscription: false,
    })
  })

  it('should not display email help message by default', async () => {
    const { getByText, getByPlaceholderText, queryByText } = render(<SetEmail {...props} />)

    const emailInput = getByPlaceholderText('tonadresse@email.com')
    await act(async () => await fireEvent.changeText(emailInput, 'john.doe@gmail.com'))

    const continueButton = getByText('Continuer')
    await act(async () => await fireEvent.press(continueButton))

    expect(
      queryByText(
        "L'e-mail renseigné est incorrect. Exemple de format attendu\u00a0: edith.piaf@email.fr"
      )
    ).toBeFalsy()
  })

  it('should reject email', async () => {
    const { getByText, getByPlaceholderText, queryByText } = render(<SetEmail {...props} />)

    const emailInput = getByPlaceholderText('tonadresse@email.com')
    await act(async () => await fireEvent.changeText(emailInput, 'john.doe'))

    const continueButton = getByText('Continuer')
    await act(async () => await fireEvent.press(continueButton))

    expect(
      queryByText(
        'L’e-mail renseigné est incorrect. Exemple de format attendu : edith.piaf@email.fr'
      )
    ).toBeTruthy()
  })

  it('should log analytics when clicking on "Se connecter" button', async () => {
    const { getByText } = render(<SetEmail {...props} />)

    const loginButton = getByText('Se connecter')
    await act(async () => await fireEvent.press(loginButton))

    expect(analytics.logLogin).toHaveBeenNthCalledWith(1, { method: 'fromSetEmail' })
  })
})
