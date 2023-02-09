import React from 'react'
import waitForExpect from 'wait-for-expect'

import { fireEvent, render, screen } from 'tests/utils'

import { SetPassword } from './SetPassword'

const props = { goToNextStep: jest.fn(), signUp: jest.fn() }

describe('SetPassword Page', () => {
  it('should display security rules', () => {
    render(<SetPassword {...props} />)

    expect(screen.getByText('12 Caractères')).toBeTruthy()
  })

  it('should disable the submit button when password is incorrect', () => {
    render(<SetPassword {...props} />)

    expect(screen.getByTestId('Continuer')).toBeDisabled()
  })

  it('should enable the submit button when password is correct', () => {
    render(<SetPassword {...props} />)

    const passwordInput = screen.getByPlaceholderText('Ton mot de passe')
    fireEvent.changeText(passwordInput, 'user@AZERTY123')

    expect(screen.getByTestId('Continuer')).toBeEnabled()
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
