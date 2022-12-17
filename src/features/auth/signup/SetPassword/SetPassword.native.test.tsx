import React from 'react'
import waitForExpect from 'wait-for-expect'

import { fireEvent, render, waitFor } from 'tests/utils'

import { SetPassword } from './SetPassword'

const props = { goToNextStep: jest.fn(), signUp: jest.fn() }

describe('SetPassword Page', () => {
  beforeEach(jest.clearAllMocks)
  afterAll(jest.clearAllMocks)

  it('should enable the submit button when password is correct', async () => {
    const { getByPlaceholderText, getByTestId } = render(<SetPassword {...props} />)

    const continueButton = getByTestId('Continuer')
    expect(continueButton).toBeDisabled()

    const passwordInput = getByPlaceholderText('Ton mot de passe')

    fireEvent.changeText(passwordInput, 'user@AZERTY123')

    await waitFor(() => {
      expect(continueButton).toBeEnabled()
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
