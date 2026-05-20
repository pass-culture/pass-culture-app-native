import mockdate from 'mockdate'
import React from 'react'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { api } from 'api/api'
import { ApiError } from 'api/ApiError'
import { EmailValidationRemainingResendsResponse } from 'api/gen'
import { PreValidationSignupStep } from 'features/auth/enums'
import { CURRENT_DATE, ELIGIBLE_AGE_DATE } from 'features/auth/fixtures/fixtures'
import * as LoginAndRedirectAPI from 'features/auth/pages/signup/helpers/useLoginAndRedirect'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { StepperOrigin } from 'features/navigation/navigators/RootNavigator/types'
import * as useGoBack from 'features/navigation/useGoBack'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { eventMonitoring } from 'libs/monitoring/services'
import { deviceInfoStoreActions } from 'shared/store/deviceInfoStore'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { setSettingsMock } from 'tests/settings/mockSettings'
import { act, fireEvent, renderAsync, screen, userEvent } from 'tests/utils'

import { SignupForm } from './SignupForm'

jest.mock('libs/network/NetInfoWrapper')

const apiSignUpSpy = jest.spyOn(api, 'postNativeV1Account')

const loginAndRedirectMock = jest.fn()
jest.spyOn(LoginAndRedirectAPI, 'useLoginAndRedirect').mockReturnValue(loginAndRedirectMock)

jest.mock('features/identityCheck/context/SubscriptionContextProvider', () => ({
  useSubscriptionContext: jest.fn(() => ({ dispatch: jest.fn() })),
}))

const mockGoBack = jest.fn()
jest.spyOn(useGoBack, 'useGoBack').mockReturnValue({
  goBack: mockGoBack,
  canGoBack: jest.fn(() => true),
})

jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    resetSearch: jest.fn(),
  }),
}))

jest.useFakeTimers()

mockdate.set(CURRENT_DATE)

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

setSettingsMock({ patchSettingsWith: { isRecaptchaEnabled: false } })

const user = userEvent.setup()

const gotoStep2 = async () => {
  await user.type(await screen.findByTestId('Entrée pour l’email'), 'email@gmail.com')

  await user.press(screen.getByLabelText('Continuer vers l’étape Mot de passe'))
  await screen.findByLabelText('Étape 2 sur 5')
}

const gotoStep3 = async () => {
  await user.type(await screen.findByTestId('Mot de passe'), 'user@AZERTY123')

  await user.press(screen.getByLabelText('Continuer vers l’étape Date de naissance'))
  await screen.findByLabelText('Étape 3 sur 5')
}

const gotoStep4 = async () => {
  await act(async () =>
    fireEvent(await screen.findByTestId('date-picker-spinner-native'), 'onChange', {
      nativeEvent: { timestamp: ELIGIBLE_AGE_DATE },
    })
  )

  await user.press(screen.getByLabelText('Continuer vers l’étape CGU & Données'))
  await screen.findByLabelText('Étape 4 sur 5')
}

describe('Signup Form', () => {
  beforeAll(() => jest.useFakeTimers({ legacyFakeTimers: true }))

  afterAll(() => jest.useRealTimers())

  beforeEach(() => {
    mockServer.getApi<EmailValidationRemainingResendsResponse>(
      '/v1/email_validation_remaining_resends/email%40gmail.com',
      { remainingResends: 3 }
    )
    useRoute.mockReturnValue({ params: { from: StepperOrigin.HOME } })
    setFeatureFlags()
    deviceInfoStoreActions.setDeviceInfo({
      deviceId: 'ad7b7b5a169641e27cadbdb35adad9c4ca23099a',
      source: 'iPhone 13',
      os: 'iOS',
    })
  })

  describe('For each step', () => {
    const stepValidationMap = [() => Promise.resolve(), gotoStep2, gotoStep3, gotoStep4]

    it.each([1, 2, 3, 4])('should render correctly for step %i/5', async (step: number) => {
      await renderSignupForm()

      await screen.findByText('Inscription')

      await stepValidationMap
        .slice(0, step)
        .reduce((prev, current) => prev.then(() => current()), Promise.resolve())

      expect(await screen.findByLabelText(`Étape ${step} sur 5`)).toBeOnTheScreen()
      expect(screen).toMatchSnapshot()
    })
  })

  describe('Quit button', () => {
    it('should not display quit button on firstStep', async () => {
      await renderSignupForm()

      await screen.findByText('Crée-toi un compte')

      const goBackButton = screen.queryByText('Quitter')

      expect(goBackButton).not.toBeOnTheScreen()
    })

    it('should open quit modal when pressing quit button on second step', async () => {
      await renderSignupForm()

      const emailInput = screen.getByTestId('Entrée pour l’email')
      await user.type(emailInput, 'email@gmail.com')
      await user.press(screen.getByText('Continuer'))
      await user.press(screen.getByText('Quitter'))

      expect(screen.getByText('Veux-tu abandonner l’inscription ?')).toBeOnTheScreen()
    })

    it('should go back to home when pressing close button on email confirmation sent', async () => {
      simulateSignupSuccess()
      await renderSignupForm()

      await gotoStep2()
      await gotoStep3()
      await gotoStep4()

      await user.press(
        screen.getByText(/J’ai lu et j’accepte les conditions générales d’utilisation/)
      )

      await user.press(screen.getByText(/J’ai lu les chartes des données personnelles/))
      await user.press(screen.getByText('S’inscrire'))
      await user.press(await screen.findByText('Fermer'))

      expect(navigate).toHaveBeenCalledWith(
        navigateToHomeConfig.screen,
        navigateToHomeConfig.params
      )
    })
  })

  describe('Go back button', () => {
    it('should call goBack() when left icon is pressed from first step', async () => {
      await renderSignupForm()

      const goBackButton = await screen.findByTestId('Revenir en arrière')
      await user.press(goBackButton)

      expect(mockGoBack).toHaveBeenCalledTimes(1)
    })

    it('should go to the previous step when go back icon is press from second step', async () => {
      await renderSignupForm()

      const emailInput = screen.getByTestId('Entrée pour l’email')
      await user.type(emailInput, 'email@gmail.com')

      const continueButton = screen.getByText('Continuer')
      await user.press(continueButton)

      const goBackButton = screen.getByTestId('Revenir en arrière')
      await user.press(goBackButton)

      const firstStepTitle = await screen.findByText('Crée-toi un compte')

      expect(firstStepTitle).toBeOnTheScreen()
    })

    it('should not display backButton on confirmation email sent page', async () => {
      simulateSignupSuccess()
      await renderSignupForm()

      const emailInput = screen.getByTestId('Entrée pour l’email')
      await user.type(emailInput, 'email@gmail.com')
      await user.press(screen.getByText('Continuer'))

      const passwordInput = screen.getByTestId('Mot de passe')
      await user.type(passwordInput, 'user@AZERTY123')
      await user.press(screen.getByText('Continuer'))

      const datePicker = screen.getByTestId('date-picker-spinner-native')
      await act(async () =>
        fireEvent(datePicker, 'onChange', { nativeEvent: { timestamp: ELIGIBLE_AGE_DATE } })
      )
      await user.press(screen.getByText('Continuer'))
      await user.press(
        screen.getByText(/J’ai lu et j’accepte les conditions générales d’utilisation/)
      )
      await user.press(screen.getByText(/J’ai lu les chartes des données personnelles/))
      await user.press(screen.getByText('S’inscrire'))

      expect(screen.queryByLabelText('Revenir en arrière')).not.toBeOnTheScreen()
    })
  })

  it('should show email sent confirmation on signup success', async () => {
    simulateSignupSuccess()
    await renderSignupForm()

    const emailInput = screen.getByTestId('Entrée pour l’email')
    await user.type(emailInput, 'email@gmail.com')
    await user.press(screen.getByText('Continuer'))

    const passwordInput = screen.getByTestId('Mot de passe')
    await user.type(passwordInput, 'user@AZERTY123')
    await user.press(screen.getByText('Continuer'))

    const datePicker = screen.getByTestId('date-picker-spinner-native')
    await act(async () =>
      fireEvent(datePicker, 'onChange', { nativeEvent: { timestamp: ELIGIBLE_AGE_DATE } })
    )
    await user.press(screen.getByText('Continuer'))
    await user.press(
      screen.getByText(/J’ai lu et j’accepte les conditions générales d’utilisation/)
    )
    await user.press(screen.getByText(/J’ai lu les chartes des données personnelles/))
    await user.press(screen.getByText('S’inscrire'))

    expect(screen.getByText('Confirme ton adresse e-mail')).toBeOnTheScreen()
  })

  describe('analytics', () => {
    it('should trigger StepperDisplayed tracker when displaying step', async () => {
      simulateSignupSuccess()
      await renderSignupForm()

      expect(analytics.logStepperDisplayed).toHaveBeenNthCalledWith(
        1,
        StepperOrigin.HOME,
        PreValidationSignupStep.Email,
        undefined
      )

      const emailInput = screen.getByTestId('Entrée pour l’email')
      await user.type(emailInput, 'email@gmail.com')
      await user.press(screen.getByTestId('Continuer vers l’étape Mot de passe'))

      expect(analytics.logStepperDisplayed).toHaveBeenNthCalledWith(
        2,
        StepperOrigin.HOME,
        PreValidationSignupStep.Password,
        undefined
      )

      const passwordInput = screen.getByTestId('Mot de passe')
      await user.type(passwordInput, 'user@AZERTY123')
      await user.press(screen.getByTestId('Continuer vers l’étape Date de naissance'))

      expect(analytics.logStepperDisplayed).toHaveBeenNthCalledWith(
        3,
        StepperOrigin.HOME,
        PreValidationSignupStep.Birthday,
        undefined
      )

      const datePicker = screen.getByTestId('date-picker-spinner-native')
      await act(async () => {
        fireEvent(datePicker, 'onChange', { nativeEvent: { timestamp: ELIGIBLE_AGE_DATE } })
      })

      await user.press(screen.getByTestId('Continuer vers l’étape CGU & Données'))

      expect(analytics.logStepperDisplayed).toHaveBeenNthCalledWith(
        4,
        StepperOrigin.HOME,
        PreValidationSignupStep.CGU,
        undefined
      )

      await user.press(
        screen.getByText(/J’ai lu et j’accepte les conditions générales d’utilisation/)
      )
      await user.press(screen.getByText(/J’ai lu les chartes des données personnelles/))
      await user.press(screen.getByText('S’inscrire'))

      expect(analytics.logStepperDisplayed).toHaveBeenNthCalledWith(
        5,
        StepperOrigin.HOME,
        PreValidationSignupStep.ConfirmationEmailSent,
        undefined
      )
    })

    it('should call logCancelSignup with Email when quitting after signup modal', async () => {
      await renderSignupForm()

      const emailInput = screen.getByTestId('Entrée pour l’email')
      await user.type(emailInput, 'email@gmail.com')
      await user.press(screen.getByText('Continuer'))

      await screen.findAllByText('Mot de passe', { hidden: true })

      await user.press(screen.getByText('Quitter'))
      await user.press(screen.getByText('Abandonner l’inscription'))

      expect(analytics.logCancelSignup).toHaveBeenCalledWith('Password')
    })
  })

  describe('API', () => {
    it('should create account when clicking on AcceptCgu button with deviceInfo', async () => {
      simulateSignupSuccess()

      await renderSignupForm()

      const emailInput = screen.getByTestId('Entrée pour l’email')
      await user.type(emailInput, 'email@gmail.com')

      await user.press(screen.getByLabelText('Continuer vers l’étape Mot de passe'))

      const passwordInput = screen.getByTestId('Mot de passe')
      await user.type(passwordInput, 'user@AZERTY123')
      await user.press(screen.getByLabelText('Continuer vers l’étape Date de naissance'))

      const datePicker = screen.getByTestId('date-picker-spinner-native')
      await act(async () =>
        fireEvent(datePicker, 'onChange', { nativeEvent: { timestamp: ELIGIBLE_AGE_DATE } })
      )
      await user.press(screen.getByLabelText('Continuer vers l’étape CGU & Données'))
      await user.press(
        screen.getByText(/J’ai lu et j’accepte les conditions générales d’utilisation/)
      )
      await user.press(screen.getByText(/J’ai lu les chartes des données personnelles/))
      await user.press(screen.getByText('S’inscrire'))

      expect(apiSignUpSpy).toHaveBeenCalledWith(
        {
          email: 'email@gmail.com',
          marketingEmailSubscription: false,
          password: 'user@AZERTY123',
          birthdate: '2003-12-01',
          token: 'dummyToken',
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
      mockServer.postApi('/v1/account', { responseOptions: { statusCode: 400, data: {} } })

      await renderSignupForm()

      const emailInput = screen.getByTestId('Entrée pour l’email')
      await user.type(emailInput, 'email@gmail.com')
      await user.press(screen.getByTestId('Continuer vers l’étape Mot de passe'))

      const passwordInput = screen.getByTestId('Mot de passe')
      await user.type(passwordInput, 'user@AZERTY123')
      await user.press(screen.getByTestId('Continuer vers l’étape Date de naissance'))
      const datePicker = screen.getByTestId('date-picker-spinner-native')
      await act(async () =>
        fireEvent(datePicker, 'onChange', { nativeEvent: { timestamp: ELIGIBLE_AGE_DATE } })
      )
      await user.press(screen.getByTestId('Continuer vers l’étape CGU & Données'))
      await user.press(
        screen.getByText(/J’ai lu et j’accepte les conditions générales d’utilisation/)
      )
      await user.press(screen.getByText(/J’ai lu les chartes des données personnelles/))
      await user.press(screen.getByText('S’inscrire'))

      expect(eventMonitoring.captureException).toHaveBeenCalledWith(
        new ApiError(400, '', 'Échec de la requête https://localhost/native/v1/account, code: 400')
      )
    })
  })
})

const simulateSignupSuccess = () => mockServer.postApi('/v1/account', {})
const renderSignupForm = () => renderAsync(reactQueryProviderHOC(<SignupForm />))
