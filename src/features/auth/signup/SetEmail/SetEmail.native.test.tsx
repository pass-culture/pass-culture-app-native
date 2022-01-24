import React from 'react'

import { SetEmail } from 'features/auth/signup/SetEmail'
import { fireEvent, render } from 'tests/utils'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

const props = { goToNextStep: jest.fn(), signUp: jest.fn() }

describe('<SetEmail />', () => {
  beforeEach(jest.clearAllMocks)
  afterAll(jest.clearAllMocks)

  it('should display disabled validate button when email input is not filled', async () => {
    const { getByTestId } = render(<SetEmail {...props} />)

    const button = getByTestId('Continuer')
    expect(button.props.style.backgroundColor).toEqual(ColorsEnum.GREY_LIGHT)
  })

  it('should enable validate button when email input is filled', async () => {
    const { getByTestId, getByPlaceholderText } = render(<SetEmail {...props} />)

    const emailInput = getByPlaceholderText('tonadresse@email.com')
    fireEvent.changeText(emailInput, 'john.doe@gmail.com')

    const button = getByTestId('Continuer')
    expect(button.props.style.backgroundColor).toEqual(ColorsEnum.PRIMARY)
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
        "L'e-mail renseigné est incorrect. Exemple de format attendu\u00a0: edith.piaf@email.fr"
      )
    ).toBeTruthy()
  })
})
