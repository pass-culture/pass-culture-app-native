import { rest } from 'msw'
import React from 'react'

import { ELIGIBLE_AGE_DATE } from 'features/auth/fixtures/fixtures'
import { SignupForm } from 'features/auth/pages/signup/SignupFormV2'
import { mockGoBack } from 'features/navigation/__mocks__/useGoBack'
import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
import { server } from 'tests/server'
import { act, fireEvent, render, screen } from 'tests/utils'

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

  it('should show email sent confirmation on signup success', async () => {
    simulateSignupSuccess()
    render(<SignupForm />)

    const emailInput = screen.getByPlaceholderText('tonadresse@email.com')
    fireEvent.changeText(emailInput, 'email@gmail.com')
    await act(() => fireEvent.press(screen.getByText('Continuer')))

    const passwordInput = screen.getByPlaceholderText('Ton mot de passe')
    await act(async () => fireEvent.changeText(passwordInput, 'user@AZERTY123'))
    await act(async () => fireEvent.press(screen.getByText('Continuer')))

    const datePicker = screen.getByTestId('date-picker-spinner-native')
    await act(async () =>
      fireEvent(datePicker, 'onChange', { nativeEvent: { timestamp: ELIGIBLE_AGE_DATE } })
    )
    await act(async () => fireEvent.press(screen.getByText('Continuer')))

    await act(async () => fireEvent.press(screen.getByText('Accepter et s’inscrire')))

    expect(screen.getByText('Confirme ton adresse e-mail')).toBeTruthy()
  })
})

const simulateSignupSuccess = () =>
  server.use(
    rest.post(env.API_BASE_URL + '/native/v1/account', (_req, res, ctx) => {
      return res.once(ctx.status(200), ctx.json({}))
    })
  )
