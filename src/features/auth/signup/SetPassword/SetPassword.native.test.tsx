import React from 'react'
import waitForExpect from 'wait-for-expect'

import { fireEvent, render, waitFor } from 'tests/utils'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

import { SetPassword } from './SetPassword'

jest.mock('features/auth/settings')

const props = { goToNextStep: jest.fn(), signUp: jest.fn() }

describe('SetPassword Page', () => {
  beforeEach(jest.clearAllMocks)
  afterAll(jest.clearAllMocks)

  it('should enable the submit button when password is correct', async () => {
    const { getByPlaceholderText, getByTestId } = render(<SetPassword {...props} />)

    const continueButton = getByTestId('Continuer')

    const background = continueButton.props.style.backgroundColor
    expect(background).toEqual(ColorsEnum.GREY_LIGHT)

    const passwordInput = getByPlaceholderText('Ton mot de passe')

    fireEvent.changeText(passwordInput, 'user@AZERTY123')

    await waitFor(async () => {
      const background = continueButton.props.style.backgroundColor
      expect(background).toEqual(ColorsEnum.PRIMARY)
    })
  })

  it('should call goToNextStep() when submitting password', async () => {
    const { getByPlaceholderText, findByText } = render(<SetPassword {...props} />)

    const passwordInput = getByPlaceholderText('Ton mot de passe')
    fireEvent.changeText(passwordInput, 'user@AZERTY123')

    const continueButton = await findByText('Continuer')
    fireEvent.press(continueButton)

    await waitForExpect(() => {
      expect(props.goToNextStep).toBeCalledTimes(1)
      expect(props.goToNextStep).toHaveBeenCalledWith({ password: 'user@AZERTY123' })
    })
  })
})
