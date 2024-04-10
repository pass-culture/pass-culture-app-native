import React from 'react'

import { ChangeEmailSetPassword } from 'features/profile/pages/ChangeEmailSetPassword/ChangeEmailSetPassword'
import { fireEvent, render, screen } from 'tests/utils'

describe('<ChangeEmailSetPassword />', () => {
  it('should match snapshot', async () => {
    render(<ChangeEmailSetPassword />)

    expect(screen).toMatchSnapshot()
  })

  it('should enable the submit button when inputs are valid', async () => {
    render(<ChangeEmailSetPassword />)

    const passwordInput = screen.getByTestId('Mot de passe')
    const confirmationInput = screen.getByTestId('Confirmer le mot de passe')

    fireEvent.changeText(passwordInput, 'user@AZERTY123')
    fireEvent.changeText(confirmationInput, 'user@AZERTY123')

    expect(await screen.findByLabelText('Créer mon mot de passe')).toBeEnabled()
  })

  it('should disable the submit button when password is not strong enough', async () => {
    render(<ChangeEmailSetPassword />)

    const passwordInput = screen.getByTestId('Mot de passe')
    const confirmationInput = screen.getByTestId('Confirmer le mot de passe')

    fireEvent.changeText(passwordInput, 'user@AZERTY')
    fireEvent.changeText(confirmationInput, 'user@AZERTY')

    expect(await screen.findByLabelText('Créer mon mot de passe')).toBeDisabled()
  })

  it("should disable the submit button when the passwords don't match", async () => {
    render(<ChangeEmailSetPassword />)

    const passwordInput = screen.getByTestId('Mot de passe')
    const confirmationInput = screen.getByTestId('Confirmer le mot de passe')

    fireEvent.changeText(passwordInput, 'user@AZERTY123')
    fireEvent.changeText(confirmationInput, 'user@AZERTY321')

    expect(await screen.findByLabelText('Créer mon mot de passe')).toBeDisabled()
  })

  it("should display error when the passwords don't match", async () => {
    render(<ChangeEmailSetPassword />)

    const passwordInput = screen.getByTestId('Mot de passe')
    const confirmationInput = screen.getByTestId('Confirmer le mot de passe')

    fireEvent.changeText(passwordInput, 'user@AZERTY123')
    fireEvent.changeText(confirmationInput, 'user@AZERTY321')

    expect(await screen.findByText('Les mots de passe ne concordent pas')).toBeOnTheScreen()
  })
})
