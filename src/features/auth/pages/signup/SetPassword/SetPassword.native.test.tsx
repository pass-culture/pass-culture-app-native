import React from 'react'

import { fireEvent, render, screen, waitFor } from 'tests/utils'

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

  it('should enable the submit button when password is correct', async () => {
    render(<SetPassword {...props} />)

    const passwordInput = screen.getByPlaceholderText('Ton mot de passe')
    fireEvent.changeText(passwordInput, 'user@AZERTY123')

    expect(await screen.findByTestId('Continuer')).toBeEnabled()
  })

  it('should go to next step when submitting password', async () => {
    render(<SetPassword {...props} />)

    const passwordInput = screen.getByPlaceholderText('Ton mot de passe')
    fireEvent.changeText(passwordInput, 'user@AZERTY123')
    fireEvent.press(await screen.findByTestId('Continuer'))

    await waitFor(() => {
      expect(props.goToNextStep).toHaveBeenCalledWith({ password: 'user@AZERTY123' })
    })
  })
})
