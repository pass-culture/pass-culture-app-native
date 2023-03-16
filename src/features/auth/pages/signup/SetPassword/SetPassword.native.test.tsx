import React from 'react'

import { act, fireEvent, render, screen } from 'tests/utils'

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

    await act(async () => {
      const passwordInput = screen.getByPlaceholderText('Ton mot de passe')
      fireEvent.changeText(passwordInput, 'user@AZERTY123')
    })

    await act(async () => {
      fireEvent.press(screen.getByTestId('Continuer'))
    })

    expect(props.goToNextStep).toHaveBeenCalledWith({ password: 'user@AZERTY123' })
  })
})
