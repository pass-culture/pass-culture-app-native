import React from 'react'

import { SetEmail } from 'features/auth/signup/SetEmail'
import { analytics } from 'libs/firebase/analytics'
import { fireEvent, render } from 'tests/utils'

const props = { goToNextStep: jest.fn(), signUp: jest.fn() }

describe('<SetEmail />', () => {
  beforeEach(jest.clearAllMocks)
  afterAll(jest.clearAllMocks)

  it('should display disabled validate button when email input is not filled', async () => {
    const { getByTestId } = render(<SetEmail {...props} />)

    const button = getByTestId('Continuer')
    expect(button).toBeDisabled()
  })

  it('should enable validate button when email input is filled', async () => {
    const { getByTestId, getByPlaceholderText } = render(<SetEmail {...props} />)

    const emailInput = getByPlaceholderText('tonadresse@email.com')
    fireEvent.changeText(emailInput, 'john.doe@gmail.com')

    const button = getByTestId('Continuer')
    expect(button).toBeEnabled()
  })

  it('should call goToNextStep() on valid email with email and newsletter params', () => {
    const { getByText, getByPlaceholderText, queryByText } = render(<SetEmail {...props} />)

    const emailInput = getByPlaceholderText('tonadresse@email.com')
    fireEvent.changeText(emailInput, 'john.doe@gmail.com')

    const continueButton = getByText('Continuer')
    fireEvent.press(continueButton)

    expect(props.goToNextStep).toBeCalledWith({
      email: 'john.doe@gmail.com',
      marketingEmailSubscription: false,
    })

    expect(
      queryByText(
        "L'e-mail renseigné est incorrect. Exemple de format attendu\u00a0: edith.piaf@email.fr"
      )
    ).toBeFalsy()
  })

  it('should reject email', () => {
    const { getByText, getByPlaceholderText, queryByText } = render(<SetEmail {...props} />)

    const emailInput = getByPlaceholderText('tonadresse@email.com')
    fireEvent.changeText(emailInput, 'john.doe')

    const continueButton = getByText('Continuer')
    fireEvent.press(continueButton)

    expect(
      queryByText(
        'L’e-mail renseigné est incorrect. Exemple de format attendu : edith.piaf@email.fr'
      )
    ).toBeTruthy()
  })

  it('should log analytics when clicking on "Se connecter" button', () => {
    const { getByText } = render(<SetEmail {...props} />)

    const loginButton = getByText('Se connecter')
    fireEvent.press(loginButton)

    expect(analytics.logLogin).toHaveBeenNthCalledWith(1, { method: 'fromSetEmail' })
  })
})
