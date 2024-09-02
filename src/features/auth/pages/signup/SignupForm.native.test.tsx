import mockdate from 'mockdate'
import React from 'react'
import DeviceInfo from 'react-native-device-info'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { api } from 'api/api'
import {
  AccountState,
  EmailValidationRemainingResendsResponse,
  OauthStateResponse,
  SigninResponse,
  UserProfileResponse,
} from 'api/gen'
import { PreValidationSignupStep } from 'features/auth/enums'
import { CURRENT_DATE, ELIGIBLE_AGE_DATE } from 'features/auth/fixtures/fixtures'
import * as LoginAndRedirectAPI from 'features/auth/pages/signup/helpers/useLoginAndRedirect'
import { SignInResponseFailure } from 'features/auth/types'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { StepperOrigin } from 'features/navigation/RootNavigator/types'
import * as useGoBack from 'features/navigation/useGoBack'
import { beneficiaryUser } from 'fixtures/user'
import { analytics } from 'libs/analytics'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { eventMonitoring } from 'libs/monitoring'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen, waitFor } from 'tests/utils'

import { SignupForm } from './SignupForm'

jest.mock('libs/campaign')
jest.mock('libs/react-native-device-info/getDeviceId')
jest.mock('libs/network/NetInfoWrapper')

const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)

const getModelSpy = jest.spyOn(DeviceInfo, 'getModel')
const getSystemNameSpy = jest.spyOn(DeviceInfo, 'getSystemName')

const apiSignUpSpy = jest.spyOn(api, 'postNativeV1Account')
const apiSSOSignUpSpy = jest.spyOn(api, 'postNativeV1OauthGoogleAccount')
const loginAndRedirectMock = jest.fn()
jest.spyOn(LoginAndRedirectAPI, 'useLoginAndRedirect').mockReturnValue(loginAndRedirectMock)

const realUseState = React.useState
const mockUseState = jest.spyOn(React, 'useState')

const apiPostGoogleAuthorize = jest.spyOn(api, 'postNativeV1OauthGoogleAuthorize')

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

mockdate.set(CURRENT_DATE)

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

describe('Signup Form', () => {
  beforeEach(() => {
    mockServer.getApi<EmailValidationRemainingResendsResponse>(
      '/v1/email_validation_remaining_resends/email%40gmail.com',
      {
        remainingResends: 3,
      }
    )
    useRoute.mockReturnValue({ params: { from: StepperOrigin.HOME } })
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

    const step = await screen.findByText('Étape 1 sur 5', { includeHiddenElements: true })

    expect(step).toBeOnTheScreen()
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

      expect(screen.getByText('Veux-tu abandonner l’inscription ?')).toBeOnTheScreen()
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

      fireEvent.press(
        screen.getByText('J’ai lu et j’accepte les conditions générales d’utilisation*')
      )
      await act(() => {
        fireEvent.press(screen.getByText('J’ai lu la charte des données personnelles*'))
      })
      await act(() => fireEvent.press(screen.getByText('S’inscrire')))

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

      fireEvent.press(
        screen.getByText('J’ai lu et j’accepte les conditions générales d’utilisation*')
      )
      await act(() => {
        fireEvent.press(screen.getByText('J’ai lu la charte des données personnelles*'))
      })
      await act(() => fireEvent.press(screen.getByText('S’inscrire')))

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

    fireEvent.press(
      screen.getByText('J’ai lu et j’accepte les conditions générales d’utilisation*')
    )
    await act(() => {
      fireEvent.press(screen.getByText('J’ai lu la charte des données personnelles*'))
    })
    await act(() => fireEvent.press(screen.getByText('S’inscrire')))

    expect(screen.getByText('Confirme ton adresse e-mail')).toBeOnTheScreen()
  })

  describe('analytics', () => {
    it('should trigger StepperDisplayed tracker when displaying step', async () => {
      simulateSignupSuccess()
      renderSignupForm()

      expect(analytics.logStepperDisplayed).toHaveBeenNthCalledWith(
        1,
        StepperOrigin.HOME,
        PreValidationSignupStep.Email,
        undefined
      )

      const emailInput = screen.getByPlaceholderText('tonadresse@email.com')
      fireEvent.changeText(emailInput, 'email@gmail.com')
      await act(async () => {
        fireEvent.press(screen.getByTestId('Continuer vers l’étape Mot de passe'))
      })

      expect(analytics.logStepperDisplayed).toHaveBeenNthCalledWith(
        2,
        StepperOrigin.HOME,
        PreValidationSignupStep.Password,
        undefined
      )

      const passwordInput = screen.getByPlaceholderText('Ton mot de passe')
      await act(async () => fireEvent.changeText(passwordInput, 'user@AZERTY123'))
      await act(async () =>
        fireEvent.press(screen.getByTestId('Continuer vers l’étape Date de naissance'))
      )

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

      await act(async () =>
        fireEvent.press(screen.getByTestId('Continuer vers l’étape CGU & Données'))
      )

      expect(analytics.logStepperDisplayed).toHaveBeenNthCalledWith(
        4,
        StepperOrigin.HOME,
        PreValidationSignupStep.CGU,
        undefined
      )

      fireEvent.press(
        screen.getByText('J’ai lu et j’accepte les conditions générales d’utilisation*')
      )
      await act(() => {
        fireEvent.press(screen.getByText('J’ai lu la charte des données personnelles*'))
      })
      await act(() => fireEvent.press(screen.getByText('S’inscrire')))

      expect(analytics.logStepperDisplayed).toHaveBeenNthCalledWith(
        5,
        StepperOrigin.HOME,
        PreValidationSignupStep.ConfirmationEmailSent,
        undefined
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

      fireEvent.press(
        screen.getByText('J’ai lu et j’accepte les conditions générales d’utilisation*')
      )
      await act(() => {
        fireEvent.press(screen.getByText('J’ai lu la charte des données personnelles*'))
      })
      await act(() => fireEvent.press(screen.getByText('S’inscrire')))

      expect(apiSignUpSpy).toHaveBeenCalledWith(
        {
          email: 'email@gmail.com',
          marketingEmailSubscription: false,
          password: 'user@AZERTY123',
          birthdate: '2003-12-01',
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
      mockServer.postApi('/v1/account', { responseOptions: { statusCode: 400, data: {} } })

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

      fireEvent.press(
        screen.getByText('J’ai lu et j’accepte les conditions générales d’utilisation*')
      )
      await act(() => {
        fireEvent.press(screen.getByText('J’ai lu la charte des données personnelles*'))
      })
      await act(() => fireEvent.press(screen.getByText('S’inscrire')))

      expect(eventMonitoring.captureException).toHaveBeenCalledWith(
        new Error('NETWORK_REQUEST_FAILED')
      )
    })
  })

  describe('SSO', () => {
    const signInFailureData: SignInResponseFailure['content'] = {
      code: 'SSO_EMAIL_NOT_FOUND',
      accountCreationToken: 'accountCreationToken',
      email: 'user@gmail.com',
      general: [],
    }

    beforeEach(() => {
      mockServer.getApi<OauthStateResponse>('/v1/oauth/state', {
        responseOptions: { data: { oauthStateToken: 'oauth_state_token' } },
        requestOptions: { persist: true },
      })
    })

    beforeAll(() => useFeatureFlagSpy.mockReturnValue(true))

    afterAll(() => useFeatureFlagSpy.mockReturnValue(false))

    it('should sign in when sso button is clicked and sso account already exists', async () => {
      getModelSpy.mockReturnValueOnce('iPhone 13')
      getSystemNameSpy.mockReturnValueOnce('iOS')
      mockServer.postApi<SigninResponse>('/v1/oauth/google/authorize', {
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
        accountState: AccountState.ACTIVE,
      })
      mockServer.getApi<UserProfileResponse>('/v1/me', beneficiaryUser)

      renderSignupForm()

      await act(async () => {})

      await act(async () => fireEvent.press(await screen.findByTestId('S’inscrire avec Google')))

      expect(apiPostGoogleAuthorize).toHaveBeenCalledWith({
        authorizationCode: 'mockServerAuthCode',
        oauthStateToken: 'oauth_state_token',
        deviceInfo: {
          deviceId: 'ad7b7b5a169641e27cadbdb35adad9c4ca23099a',
          os: 'iOS',
          source: 'iPhone 13',
        },
      })
    })

    it('should go to next step when sso button is clicked and sso account does not exist', async () => {
      mockServer.postApi<SignInResponseFailure['content']>('/v1/oauth/google/authorize', {
        responseOptions: {
          statusCode: 401,
          data: signInFailureData,
        },
      })

      renderSignupForm()

      await act(async () => {})

      await act(async () => fireEvent.press(await screen.findByTestId('S’inscrire avec Google')))

      expect(screen.getByText('Renseigne ton âge')).toBeOnTheScreen()
    })

    it('should go back to email step instead of password step when signing up with sso button', async () => {
      mockServer.postApi<SignInResponseFailure['content']>('/v1/oauth/google/authorize', {
        responseOptions: {
          statusCode: 401,
          data: signInFailureData,
        },
      })

      renderSignupForm()

      await act(async () => fireEvent.press(await screen.findByTestId('S’inscrire avec Google')))

      await act(async () => fireEvent.press(screen.getByTestId('Revenir en arrière')))

      expect(screen.getByText('Crée-toi un compte')).toBeOnTheScreen()
    })

    it('should display go back for last step', async () => {
      mockServer.postApi<SignInResponseFailure['content']>('/v1/oauth/google/authorize', {
        responseOptions: {
          statusCode: 401,
          data: signInFailureData,
        },
      })

      renderSignupForm()

      await act(async () => {})
      await act(async () => fireEvent.press(await screen.findByTestId('S’inscrire avec Google')))

      const datePicker = screen.getByTestId('date-picker-spinner-native')
      await act(async () =>
        fireEvent(datePicker, 'onChange', { nativeEvent: { timestamp: ELIGIBLE_AGE_DATE } })
      )
      await act(async () => fireEvent.press(screen.getByText('Continuer')))

      expect(screen.getByText('S’inscrire')).toBeOnTheScreen()
      expect(screen.getByTestId('Revenir en arrière')).toBeOnTheScreen()
    })

    it('should reset isSSOSubscription state when choosing sso first then choosing default signup', async () => {
      mockServer.postApi<SignInResponseFailure['content']>('/v1/oauth/google/authorize', {
        responseOptions: {
          statusCode: 401,
          data: signInFailureData,
        },
      })

      renderSignupForm()

      await act(async () => fireEvent.press(await screen.findByTestId('S’inscrire avec Google')))

      await act(async () => fireEvent.press(screen.getByTestId('Revenir en arrière')))

      const emailInput = screen.getByPlaceholderText('tonadresse@email.com')
      fireEvent.changeText(emailInput, 'email@gmail.com')
      await act(() => fireEvent.press(screen.getByText('Continuer')))

      expect(screen.getByText('Choisis un mot de passe')).toBeOnTheScreen()
    })

    it('should create SSO account when clicking on AcceptCgu button', async () => {
      getModelSpy.mockReturnValueOnce('iPhone 13') // first call in useSignIn
      getSystemNameSpy.mockReturnValueOnce('iOS') // first call in useSignIn
      getModelSpy.mockReturnValueOnce('iPhone 13') // second call in SignupForm
      getSystemNameSpy.mockReturnValueOnce('iOS') // second call in SignupForm
      mockServer.postApi<SignInResponseFailure['content']>('/v1/oauth/google/authorize', {
        responseOptions: {
          statusCode: 401,
          data: signInFailureData,
        },
      })
      mockServer.postApi<SigninResponse>('/v1/oauth/google/account', {
        responseOptions: {
          statusCode: 200,
          data: {
            accessToken: 'accessToken',
            refreshToken: 'refreshToken',
            accountState: AccountState.ACTIVE,
          },
        },
      })

      renderSignupForm()

      await act(async () => {})
      await act(async () => fireEvent.press(await screen.findByTestId('S’inscrire avec Google')))

      const datePicker = screen.getByTestId('date-picker-spinner-native')
      await act(async () =>
        fireEvent(datePicker, 'onChange', { nativeEvent: { timestamp: ELIGIBLE_AGE_DATE } })
      )
      await act(async () => fireEvent.press(screen.getByText('Continuer')))
      fireEvent.press(
        screen.getByText('J’ai lu et j’accepte les conditions générales d’utilisation*')
      )
      await act(() => {
        fireEvent.press(screen.getByText('J’ai lu la charte des données personnelles*'))
      })
      await act(() => fireEvent.press(screen.getByText('S’inscrire')))

      expect(apiSSOSignUpSpy).toHaveBeenCalledWith(
        {
          accountCreationToken: 'accountCreationToken',
          marketingEmailSubscription: false,
          birthdate: '2003-12-01',
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

    it('should login and redirect user on SSO signup success', async () => {
      mockServer.postApi<SignInResponseFailure['content']>('/v1/oauth/google/authorize', {
        responseOptions: {
          statusCode: 401,
          data: signInFailureData,
        },
      })
      mockServer.postApi<SigninResponse>('/v1/oauth/google/account', {
        responseOptions: {
          statusCode: 200,
          data: {
            accessToken: 'accessToken',
            refreshToken: 'refreshToken',
            accountState: AccountState.ACTIVE,
          },
        },
      })

      renderSignupForm()

      const ssoButton = await screen.findByTestId('S’inscrire avec Google')

      await waitFor(async () => {
        expect(ssoButton.props.focusable).toBeTruthy()
      })

      await act(async () => fireEvent.press(ssoButton))

      const datePicker = screen.getByTestId('date-picker-spinner-native')
      await act(async () =>
        fireEvent(datePicker, 'onChange', { nativeEvent: { timestamp: ELIGIBLE_AGE_DATE } })
      )
      await act(async () => fireEvent.press(screen.getByText('Continuer')))
      fireEvent.press(
        screen.getByText('J’ai lu et j’accepte les conditions générales d’utilisation*')
      )
      await act(() => {
        fireEvent.press(screen.getByText('J’ai lu la charte des données personnelles*'))
      })
      await act(() => fireEvent.press(screen.getByText('S’inscrire')))

      expect(loginAndRedirectMock).toHaveBeenCalledWith(
        {
          accessToken: 'accessToken',
          refreshToken: 'refreshToken',
        },
        'SSO_signup'
      )
    })

    it('should login and redirect user on SSO signup success when coming from signup', async () => {
      // eslint-disable-next-line local-rules/independent-mocks
      useRoute.mockReturnValue({
        params: {
          accountCreationToken: 'accountCreationToken',
          email: 'user@gmail.com',
          from: StepperOrigin.LOGIN,
        },
      })
      mockServer.postApi<SigninResponse>('/v1/oauth/google/account', {
        responseOptions: {
          statusCode: 200,
          data: {
            accessToken: 'accessToken',
            refreshToken: 'refreshToken',
            accountState: AccountState.ACTIVE,
          },
        },
      })

      renderSignupForm()

      const datePicker = screen.getByTestId('date-picker-spinner-native')
      await act(async () =>
        fireEvent(datePicker, 'onChange', { nativeEvent: { timestamp: ELIGIBLE_AGE_DATE } })
      )
      await act(async () => fireEvent.press(screen.getByText('Continuer')))
      fireEvent.press(
        screen.getByText('J’ai lu et j’accepte les conditions générales d’utilisation*')
      )
      await act(() => {
        fireEvent.press(screen.getByText('J’ai lu la charte des données personnelles*'))
      })
      await act(() => fireEvent.press(screen.getByText('S’inscrire')))

      expect(loginAndRedirectMock).toHaveBeenCalledWith(
        {
          accessToken: 'accessToken',
          refreshToken: 'refreshToken',
        },
        'SSO_login'
      )
    })

    it('should directly go to birthday step when account creation token is in route params', async () => {
      useRoute.mockReturnValueOnce({
        params: { accountCreationToken: 'accountCreationToken', email: 'user@gmail.com' },
      })

      renderSignupForm()

      expect(await screen.findByText('Renseigne ton âge')).toBeOnTheScreen()
    })

    it('should create SSO account when clicking on AcceptCgu button and coming from login', async () => {
      useRoute.mockReturnValueOnce({
        params: {
          accountCreationToken: 'accountCreationToken',
          email: 'user@gmail.com',
          from: StepperOrigin.LOGIN,
        },
      })
      getModelSpy.mockReturnValueOnce('iPhone 13') // first call in useSignIn
      getSystemNameSpy.mockReturnValueOnce('iOS') // first call in useSignIn
      getModelSpy.mockReturnValueOnce('iPhone 13') // second call in SignupForm
      getSystemNameSpy.mockReturnValueOnce('iOS') // second call in SignupForm
      mockServer.postApi<SigninResponse>('/v1/oauth/google/account', {
        responseOptions: {
          statusCode: 200,
          data: {
            accessToken: 'accessToken',
            refreshToken: 'refreshToken',
            accountState: AccountState.ACTIVE,
          },
        },
      })

      renderSignupForm()

      const datePicker = await screen.findByTestId('date-picker-spinner-native')
      await act(async () =>
        fireEvent(datePicker, 'onChange', { nativeEvent: { timestamp: ELIGIBLE_AGE_DATE } })
      )
      await act(async () => fireEvent.press(screen.getByText('Continuer')))
      fireEvent.press(
        screen.getByText('J’ai lu et j’accepte les conditions générales d’utilisation*')
      )
      await act(() => {
        fireEvent.press(screen.getByText('J’ai lu la charte des données personnelles*'))
      })
      await act(() => fireEvent.press(screen.getByText('S’inscrire')))

      expect(apiSSOSignUpSpy).toHaveBeenCalledWith(
        {
          accountCreationToken: 'accountCreationToken',
          marketingEmailSubscription: false,
          birthdate: '2003-12-01',
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

    describe('analytics', () => {
      it('should trigger StepperDisplayed tracker with SSO_signup type when displaying step for sso subscription', async () => {
        mockServer.postApi<SignInResponseFailure['content']>('/v1/oauth/google/authorize', {
          responseOptions: {
            statusCode: 401,
            data: signInFailureData,
          },
        })

        renderSignupForm()

        const ssoButton = await screen.findByTestId('S’inscrire avec Google')

        expect(analytics.logStepperDisplayed).toHaveBeenNthCalledWith(
          1,
          StepperOrigin.HOME,
          PreValidationSignupStep.Email,
          undefined
        )

        await waitFor(async () => {
          expect(ssoButton.props.focusable).toBeTruthy()
        })

        await act(async () => fireEvent.press(ssoButton))

        await waitFor(() => {
          expect(analytics.logStepperDisplayed).toHaveBeenNthCalledWith(
            2,
            StepperOrigin.HOME,
            PreValidationSignupStep.Birthday,
            'SSO_signup'
          )
        })

        const datePicker = screen.getByTestId('date-picker-spinner-native')
        await act(async () => {
          fireEvent(datePicker, 'onChange', { nativeEvent: { timestamp: ELIGIBLE_AGE_DATE } })
        })

        await act(async () =>
          fireEvent.press(screen.getByTestId('Continuer vers l’étape CGU & Données'))
        )

        expect(analytics.logStepperDisplayed).toHaveBeenNthCalledWith(
          3,
          StepperOrigin.HOME,
          PreValidationSignupStep.CGU,
          'SSO_signup'
        )
      })

      it('should trigger StepperDisplayed tracker with SSO_login type when displaying step for sso subscription and coming from login', async () => {
        // eslint-disable-next-line local-rules/independent-mocks
        useRoute.mockReturnValue({
          params: {
            accountCreationToken: 'accountCreationToken',
            email: 'user@gmail.com',
            from: StepperOrigin.LOGIN,
          },
        })

        renderSignupForm()

        expect(analytics.logStepperDisplayed).toHaveBeenNthCalledWith(
          1,
          StepperOrigin.LOGIN,
          PreValidationSignupStep.Email,
          'SSO_login'
        )

        expect(analytics.logStepperDisplayed).toHaveBeenNthCalledWith(
          2,
          StepperOrigin.LOGIN,
          PreValidationSignupStep.Birthday,
          'SSO_login'
        )

        const datePicker = screen.getByTestId('date-picker-spinner-native')
        await act(async () => {
          fireEvent(datePicker, 'onChange', { nativeEvent: { timestamp: ELIGIBLE_AGE_DATE } })
        })

        await act(async () =>
          fireEvent.press(screen.getByTestId('Continuer vers l’étape CGU & Données'))
        )

        expect(analytics.logStepperDisplayed).toHaveBeenNthCalledWith(
          3,
          StepperOrigin.LOGIN,
          PreValidationSignupStep.CGU,
          'SSO_login'
        )
      })
    })
  })
})

const simulateSignupSuccess = () => mockServer.postApi('/v1/account', {})

const renderSignupForm = () => render(reactQueryProviderHOC(<SignupForm />))
