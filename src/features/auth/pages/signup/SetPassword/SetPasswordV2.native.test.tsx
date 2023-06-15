import React from 'react'

import { act, fireEvent, render, screen } from 'tests/utils'

import { SetPasswordV2 } from './SetPasswordV2'

const props = { goToNextStep: jest.fn(), signUp: jest.fn() }

describe('SetPasswordV2 Page', () => {
  it('should display security rules', () => {
    render(<SetPasswordV2 {...props} />)

    expect(screen.getByText('12 caractères')).toBeTruthy()
  })

  it('should disable the submit button when password is incorrect', () => {
    render(<SetPasswordV2 {...props} />)

    expect(screen.getByTestId('Continuer')).toBeDisabled()
  })

  it('should enable the submit button when password is correct', async () => {
    render(<SetPasswordV2 {...props} />)

    const passwordInput = screen.getByPlaceholderText('Ton mot de passe')
    fireEvent.changeText(passwordInput, 'user@AZERTY123')

    expect(await screen.findByTestId('Continuer')).toBeEnabled()
  })

  it('should go to next step when submitting password', async () => {
    render(<SetPasswordV2 {...props} />)

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
