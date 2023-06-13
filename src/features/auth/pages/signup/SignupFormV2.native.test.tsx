import React from 'react'

import { SignupForm } from 'features/auth/pages/signup/SignupFormV2'
import { mockGoBack } from 'features/navigation/__mocks__/useGoBack'
import { analytics } from 'libs/analytics'
import { fireEvent, render, screen } from 'tests/utils'

describe('Signup Form', () => {
  it('should not display quit button on firstStep', async () => {
    render(<SignupForm />)

    await screen.findByText('Crée-toi un compte')

    const goBackButton = screen.queryByText('Annuler')
    expect(goBackButton).toBeNull()
  })

  it('should call goBack() when left icon is pressed from first step', async () => {
    render(<SignupForm />)

    const goBackButton = await screen.findByTestId('Revenir en arrière')
    fireEvent.press(goBackButton)

    expect(mockGoBack).toBeCalledTimes(1)
  })

  it('should log analytics when clicking on close icon', async () => {
    render(<SignupForm />)

    const emailInput = screen.getByPlaceholderText('tonadresse@email.com')
    fireEvent.changeText(emailInput, 'email@gmail.com')

    const continueButton = screen.getByText('Continuer')
    fireEvent.press(continueButton)

    await screen.findAllByText('Mot de passe')

    const goBackButton = screen.getByText('Annuler')
    fireEvent.press(goBackButton)

    expect(analytics.logQuitSignup).toHaveBeenNthCalledWith(1, 'SetPasswordV2')
  })

  it('should go to the previous step when left icon is press from second step', async () => {
    render(<SignupForm />)

    const emailInput = screen.getByPlaceholderText('tonadresse@email.com')
    fireEvent.changeText(emailInput, 'email@gmail.com')

    const continueButton = screen.getByText('Continuer')
    fireEvent.press(continueButton)

    const goBackButton = screen.getByTestId('Revenir en arrière')
    fireEvent.press(goBackButton)

    const firstStepTitle = await screen.findByText('Crée-toi un compte')
    expect(firstStepTitle).toBeTruthy()
  })

  it('should display the title according to the first step', async () => {
    render(<SignupForm />)

    const firstStepTitle = await screen.findByText('Crée-toi un compte')
    expect(firstStepTitle).toBeTruthy()
  })

  it('should display the title according to the second step', async () => {
    render(<SignupForm />)

    const emailInput = screen.getByPlaceholderText('tonadresse@email.com')
    fireEvent.changeText(emailInput, 'email@gmail.com')

    const continueButton = screen.getByText('Continuer')
    fireEvent.press(continueButton)

    const passwordInput = await screen.findAllByText('Mot de passe')
    expect(passwordInput).toBeTruthy()
  })
})
