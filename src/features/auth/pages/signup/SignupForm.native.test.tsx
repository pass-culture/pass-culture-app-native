import mockdate from 'mockdate'
import React from 'react'
import DeviceInfo from 'react-native-device-info'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { api } from 'api/api'
import { EmailValidationRemainingResendsResponse } from 'api/gen'
import { PreValidationSignupStep } from 'features/auth/enums'
import { CURRENT_DATE, ELIGIBLE_AGE_DATE } from 'features/auth/fixtures/fixtures'
import { mockGoBack } from 'features/navigation/__mocks__/useGoBack'
import { navigateToHomeConfig } from 'features/navigation/helpers'
import { StepperOrigin } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { eventMonitoring } from 'libs/monitoring'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen } from 'tests/utils'

import { SignupForm } from './SignupForm'

jest.mock('features/identityCheck/context/SubscriptionContextProvider', () => ({
  useSubscriptionContext: jest.fn(() => ({ dispatch: jest.fn() })),
}))
jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)

const getModelSpy = jest.spyOn(DeviceInfo, 'getModel')
const getSystemNameSpy = jest.spyOn(DeviceInfo, 'getSystemName')

const apiSignUpSpy = jest.spyOn(api, 'postNativeV1Account')

const realUseState = React.useState
const mockUseState = jest.spyOn(React, 'useState')

mockdate.set(CURRENT_DATE)

useRoute.mockReturnValue({ params: { from: StepperOrigin.HOME } })

describe('Signup Form', () => {
  beforeEach(() => {
    mockServer.getApiV1<EmailValidationRemainingResendsResponse>(
      '/email_validation_remaining_resends/email%40gmail.com',
      {
        remainingResends: 3,
      }
    )
  })

  it.each`
    stepIndex | component
    ${0}      | ${'SetEmail'}
    ${1}      | ${'SetPassword'}
    ${2}      | ${'SetBirthday'}
    ${3}      | ${'AcceptCgu'}
  `('should render correctly for $component', async ({ stepIndex }) => {
    mockUseState.mockImplementationOnce(() => realUseState(stepIndex))
    mockUseState.mockImplementationOnce(() => realUseState(stepIndex))
    renderSignupForm()

    await screen.findByText('Inscription')

    expect(screen).toMatchSnapshot()
  })

  it('should have accessibility label indicating current step and total steps', async () => {
    renderSignupForm()

    expect(
      await screen.findByText('Étape 1 sur 5', { includeHiddenElements: true })
    ).toBeOnTheScreen()
  })

  describe('Quit button', () => {
    it('should not display quit button on firstStep', async () => {
      renderSignupForm()

      await screen.findByText('Crée-toi un compte')

      const goBackButton = screen.queryByText('Quitter')

      expect(goBackButton).not.toBeOnTheScreen()
    })

    it('should open quit modal when pressing quit button on second step', async () => {
      renderSignupForm()

      const emailInput = screen.getByPlaceholderText('tonadresse@email.com')
      fireEvent.changeText(emailInput, 'email@gmail.com')
      await act(() => fireEvent.press(screen.getByText('Continuer')))

      fireEvent.press(screen.getByText('Quitter'))

      expect(screen.queryByText('Veux-tu abandonner l’inscription ?')).toBeOnTheScreen()
    })

    it('should go back to home when pressing close button on email confirmation sent', async () => {
      simulateSignupSuccess()
      renderSignupForm()

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
  })

  describe('Go back button', () => {
    it('should call goBack() when left icon is pressed from first step', async () => {
      renderSignupForm()

      const goBackButton = await screen.findByTestId('Revenir en arrière')
      fireEvent.press(goBackButton)

      expect(mockGoBack).toHaveBeenCalledTimes(1)
    })

    it('should go to the previous step when go back icon is press from second step', async () => {
      renderSignupForm()

      const emailInput = screen.getByPlaceholderText('tonadresse@email.com')
      fireEvent.changeText(emailInput, 'email@gmail.com')

      const continueButton = screen.getByText('Continuer')
      await act(async () => {
        fireEvent.press(continueButton)
      })

      const goBackButton = screen.getByTestId('Revenir en arrière')
      await act(async () => {
        fireEvent.press(goBackButton)
      })

      const firstStepTitle = await screen.findByText('Crée-toi un compte')

      expect(firstStepTitle).toBeOnTheScreen()
    })

    it('should not display backButton on confirmation email sent page', async () => {
      simulateSignupSuccess()
      renderSignupForm()

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

      expect(screen.queryByLabelText('Revenir en arrière')).not.toBeOnTheScreen()
    })
  })

  it('should show email sent confirmation on signup success', async () => {
    simulateSignupSuccess()
    renderSignupForm()

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

    expect(screen.getByText('Confirme ton adresse e-mail')).toBeOnTheScreen()
  })

  describe('analytics', () => {
    it('should trigger StepperDisplayed tracker when displaying step', async () => {
      simulateSignupSuccess()
      renderSignupForm()

      expect(analytics.logStepperDisplayed).toHaveBeenNthCalledWith(
        1,
        StepperOrigin.HOME,
        PreValidationSignupStep.Email
      )

      const emailInput = screen.getByPlaceholderText('tonadresse@email.com')
      fireEvent.changeText(emailInput, 'email@gmail.com')
      await act(async () => {
        fireEvent.press(screen.getByTestId('Continuer vers l’étape Mot de passe'))
      })

      expect(analytics.logStepperDisplayed).toHaveBeenNthCalledWith(
        2,
        StepperOrigin.HOME,
        PreValidationSignupStep.Password
      )

      const passwordInput = screen.getByPlaceholderText('Ton mot de passe')
      await act(async () => fireEvent.changeText(passwordInput, 'user@AZERTY123'))
      await act(async () =>
        fireEvent.press(screen.getByTestId('Continuer vers l’étape Date de naissance'))
      )

      expect(analytics.logStepperDisplayed).toHaveBeenNthCalledWith(
        3,
        StepperOrigin.HOME,
        PreValidationSignupStep.Birthday
      )

      const datePicker = screen.getByTestId('date-picker-spinner-native')
      await act(async () => {
        fireEvent(datePicker, 'onChange', { nativeEvent: { timestamp: ELIGIBLE_AGE_DATE } })
      })

      await act(async () =>
        fireEvent.press(screen.getByTestId('Continuer vers l’étape CGU & Données'))
      )

      expect(analytics.logStepperDisplayed).toHaveBeenNthCalledWith(
        4,
        StepperOrigin.HOME,
        PreValidationSignupStep.CGU
      )

      await act(async () => fireEvent.press(screen.getByText('Accepter et s’inscrire')))

      expect(analytics.logStepperDisplayed).toHaveBeenNthCalledWith(
        5,
        StepperOrigin.HOME,
        PreValidationSignupStep.ConfirmationEmailSent
      )
    })

    it('should log analytics when clicking on close icon', async () => {
      renderSignupForm()

      const emailInput = screen.getByPlaceholderText('tonadresse@email.com')
      fireEvent.changeText(emailInput, 'email@gmail.com')

      const continueButton = screen.getByText('Continuer')
      fireEvent.press(continueButton)

      await screen.findAllByText('Mot de passe')

      const quitButton = screen.getByText('Quitter')
      fireEvent.press(quitButton)

      expect(analytics.logQuitSignup).toHaveBeenNthCalledWith(1, 'SetPassword')
    })

    it('should call logCancelSignup with Email when quitting after signup modal', async () => {
      renderSignupForm()

      const emailInput = screen.getByPlaceholderText('tonadresse@email.com')
      fireEvent.changeText(emailInput, 'email@gmail.com')
      fireEvent.press(screen.getByText('Continuer'))

      await screen.findAllByText('Mot de passe')

      fireEvent.press(screen.getByText('Quitter'))
      fireEvent.press(screen.getByText('Abandonner l’inscription'))

      expect(analytics.logCancelSignup).toHaveBeenCalledWith('Password')
    })
  })

  describe('API', () => {
    it('should create account when clicking on AcceptCgu button with trustedDevice', async () => {
      simulateSignupSuccess()

      // First call (useSignUp)
      getModelSpy.mockReturnValueOnce('iPhone 13')
      getSystemNameSpy.mockReturnValueOnce('iOS')

      // Second call (useSignIn)
      getModelSpy.mockReturnValueOnce('iPhone 13')
      getSystemNameSpy.mockReturnValueOnce('iOS')

      renderSignupForm()

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

      expect(apiSignUpSpy).toHaveBeenCalledWith(
        {
          email: 'email@gmail.com',
          marketingEmailSubscription: false,
          password: 'user@AZERTY123',
          birthdate: '2003-12-01',
          postalCode: '',
          token: 'dummyToken',
          appsFlyerPlatform: 'ios',
          appsFlyerUserId: 'uniqueCustomerId',
          firebasePseudoId: 'firebase_pseudo_id',
          trustedDevice: {
            deviceId: 'ad7b7b5a169641e27cadbdb35adad9c4ca23099a',
            os: 'iOS',
            source: 'iPhone 13',
          },
        },
        { credentials: 'omit' }
      )
    })

    it('should log to sentry on API error', async () => {
      mockServer.postApiV1('/account', { responseOptions: { statusCode: 400, data: {} } })

      renderSignupForm()

      const emailInput = screen.getByPlaceholderText('tonadresse@email.com')
      fireEvent.changeText(emailInput, 'email@gmail.com')
      await act(() => fireEvent.press(screen.getByTestId('Continuer vers l’étape Mot de passe')))

      const passwordInput = screen.getByPlaceholderText('Ton mot de passe')
      await act(async () => fireEvent.changeText(passwordInput, 'user@AZERTY123'))
      await act(async () =>
        fireEvent.press(screen.getByTestId('Continuer vers l’étape Date de naissance'))
      )

      const datePicker = screen.getByTestId('date-picker-spinner-native')
      await act(async () =>
        fireEvent(datePicker, 'onChange', { nativeEvent: { timestamp: ELIGIBLE_AGE_DATE } })
      )
      await act(async () =>
        fireEvent.press(screen.getByTestId('Continuer vers l’étape CGU & Données'))
      )

      await act(async () => fireEvent.press(screen.getByText('Accepter et s’inscrire')))

      expect(eventMonitoring.captureException).toHaveBeenCalledWith(
        new Error('NETWORK_REQUEST_FAILED')
      )
    })
  })
})

const simulateSignupSuccess = () => mockServer.postApiV1('/account', {})

const renderSignupForm = () => render(reactQueryProviderHOC(<SignupForm />))
