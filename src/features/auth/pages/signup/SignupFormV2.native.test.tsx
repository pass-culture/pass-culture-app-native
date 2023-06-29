import { rest } from 'msw'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { ELIGIBLE_AGE_DATE } from 'features/auth/fixtures/fixtures'
import { SignupForm } from 'features/auth/pages/signup/SignupFormV2'
import { mockGoBack } from 'features/navigation/__mocks__/useGoBack'
import { navigateToHomeConfig } from 'features/navigation/helpers'
import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
import { server } from 'tests/server'
import { act, fireEvent, render, screen } from 'tests/utils'

describe('Signup Form', () => {
  it('should have accessibility label indicating current step and total steps', async () => {
    render(<SignupForm />)

    expect(await screen.findByText('Étape 1 sur 5')).toBeTruthy()
  })

  describe('Quit button', () => {
    it('should not display quit button on firstStep', async () => {
      render(<SignupForm />)

      await screen.findByText('Crée-toi un compte')

      const goBackButton = screen.queryByText('Annuler')
      expect(goBackButton).toBeNull()
    })

    it('should open quit modal when pressing quit button on second step', async () => {
      render(<SignupForm />)

      const emailInput = screen.getByPlaceholderText('tonadresse@email.com')
      fireEvent.changeText(emailInput, 'email@gmail.com')
      await act(() => fireEvent.press(screen.getByText('Continuer')))

      fireEvent.press(screen.getByText('Annuler'))

      expect(screen.queryByText('Veux-tu abandonner l’inscription ?')).toBeTruthy()
    })

    it('should go back to home when pressing close button on email confirmation sent', async () => {
      simulateSignupSuccess()
      render(<SignupForm />)

      const emailInput = screen.getByPlaceholderText('tonadresse@email.com')
      fireEvent.changeText(emailInput, 'email@gmail.com')
      await act(() => fireEvent.press(screen.getByLabelText('Continuer vers l’étape Mot de passe')))

      const passwordInput = screen.getByPlaceholderText('Ton mot de passe')
      await act(async () => fireEvent.changeText(passwordInput, 'user@AZERTY123'))
      await act(async () =>
        fireEvent.press(screen.getByLabelText('Continuer vers l’étape Date de naissance'))
      )

      const datePicker = screen.getByTestId('date-picker-spinner-native')
      await act(async () =>
        fireEvent(datePicker, 'onChange', { nativeEvent: { timestamp: ELIGIBLE_AGE_DATE } })
      )
      await act(async () =>
        fireEvent.press(screen.getByLabelText('Continuer vers l’étape CGU & Données'))
      )

      await act(async () => fireEvent.press(screen.getByText('Accepter et s’inscrire')))

      const closeButton = screen.getByText('Fermer')
      fireEvent.press(closeButton)

      expect(navigate).toHaveBeenCalledWith(
        navigateToHomeConfig.screen,
        navigateToHomeConfig.params
      )
    })

    it('should log analytics when clicking on close icon', async () => {
      render(<SignupForm />)

      const emailInput = screen.getByPlaceholderText('tonadresse@email.com')
      fireEvent.changeText(emailInput, 'email@gmail.com')

      const continueButton = screen.getByText('Continuer')
      fireEvent.press(continueButton)

      await screen.findAllByText('Mot de passe')

      const quitButton = screen.getByText('Annuler')
      fireEvent.press(quitButton)

      expect(analytics.logQuitSignup).toHaveBeenNthCalledWith(1, 'SetPasswordV2')
    })
  })

  describe('Go back button', () => {
    it('should call goBack() when left icon is pressed from first step', async () => {
      render(<SignupForm />)

      const goBackButton = await screen.findByTestId('Revenir en arrière')
      fireEvent.press(goBackButton)

      expect(mockGoBack).toBeCalledTimes(1)
    })

    it('should go to the previous step when go back icon is press from second step', async () => {
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

    it('should not display backButton on confirmation email sent page', async () => {
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

      expect(screen.queryByLabelText('Revenir en arrière')).toBeNull()
    })
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

    expect(screen.queryByLabelText('Revenir en arrière')).toBeNull()
  })

  it('should go back to home when pressing close button on email confirmation sent', async () => {
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

    const closeButton = screen.getByText('Fermer')
    fireEvent.press(closeButton)

    expect(navigate).toHaveBeenCalledWith(navigateToHomeConfig.screen, navigateToHomeConfig.params)
  })
})

const simulateSignupSuccess = () =>
  server.use(
    rest.post(env.API_BASE_URL + '/native/v1/account', (_req, res, ctx) => {
      return res.once(ctx.status(200), ctx.json({}))
    })
  )
