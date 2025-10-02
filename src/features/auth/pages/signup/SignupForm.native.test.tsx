import mockdate from 'mockdate'
import React from 'react'
import DeviceInfo from 'react-native-device-info'
import { ReactTestInstance } from 'react-test-renderer'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { api } from 'api/api'
import { ApiError } from 'api/ApiError'
import {
  AccountState,
  EmailValidationRemainingResendsResponse,
  OauthStateResponse,
  SigninResponse,
} from 'api/gen'
import { PreValidationSignupStep } from 'features/auth/enums'
import { CURRENT_DATE, ELIGIBLE_AGE_DATE } from 'features/auth/fixtures/fixtures'
import * as LoginAndRedirectAPI from 'features/auth/pages/signup/helpers/useLoginAndRedirect'
import { SignInResponseFailure } from 'features/auth/types'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { StepperOrigin } from 'features/navigation/RootNavigator/types'
import * as useGoBack from 'features/navigation/useGoBack'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { beneficiaryUser } from 'fixtures/user'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { eventMonitoring } from 'libs/monitoring/services'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import {
  act,
  fireEvent,
  renderAsync,
  screen,
  userEvent,
  waitFor,
  waitForButtonToBePressable,
} from 'tests/utils'

import { SignupForm } from './SignupForm'

jest.mock('libs/campaign/campaign')
jest.mock('libs/react-native-device-info/getDeviceId')
jest.mock('libs/network/NetInfoWrapper')

const getModelSpy = jest.spyOn(DeviceInfo, 'getModel')
const getSystemNameSpy = jest.spyOn(DeviceInfo, 'getSystemName')

const apiSignUpSpy = jest.spyOn(api, 'postNativeV1Account')
const apiSSOSignUpSpy = jest.spyOn(api, 'postNativeV1OauthGoogleAccount')

const loginAndRedirectMock = jest.fn()
jest.spyOn(LoginAndRedirectAPI, 'useLoginAndRedirect').mockReturnValue(loginAndRedirectMock)

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

jest.useFakeTimers()

mockdate.set(CURRENT_DATE)

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()

const gotoStep2 = async () => {
  await user.type(await screen.findByTestId('Entrée pour l’email'), 'email@gmail.com')

  await user.press(screen.getByLabelText('Continuer vers l’étape Mot de passe'))
  await screen.findByText('Étape 2 sur 5', { includeHiddenElements: true })
}

const gotoStep3 = async () => {
  await user.type(await screen.findByPlaceholderText('Ton mot de passe'), 'user@AZERTY123')

  await user.press(screen.getByLabelText('Continuer vers l’étape Date de naissance'))
  await screen.findByText('Étape 3 sur 5', { includeHiddenElements: true })
}

const gotoStep4 = async () => {
  await act(async () =>
    fireEvent(await screen.findByTestId('date-picker-spinner-native'), 'onChange', {
      nativeEvent: { timestamp: ELIGIBLE_AGE_DATE },
    })
  )

  await user.press(screen.getByLabelText('Continuer vers l’étape CGU & Données'))

  await screen.findByText('Étape 4 sur 5', { includeHiddenElements: true })
}

describe('Signup Form', () => {
  beforeAll(() => {
    jest.useFakeTimers({ legacyFakeTimers: true })
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  beforeEach(() => {
    mockServer.getApi<EmailValidationRemainingResendsResponse>(
      '/v1/email_validation_remaining_resends/email%40gmail.com',
      {
        remainingResends: 3,
      }
    )
    useRoute.mockReturnValue({ params: { from: StepperOrigin.HOME } })
    setFeatureFlags()
  })

  describe('For each step', () => {
    const stepValidationMap = [() => Promise.resolve(), gotoStep2, gotoStep3, gotoStep4]

    it.each([1, 2, 3, 4])('should render correctly for step %i/5', async (step: number) => {
      await renderSignupForm()

      await screen.findByText('Inscription')

      await stepValidationMap
        .slice(0, step)
        .reduce((prev, current) => prev.then(() => current()), Promise.resolve())

      expect(
        await screen.findByText(`Étape ${step} sur 5`, { includeHiddenElements: true })
      ).toBeOnTheScreen()
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

      await user.press(screen.getByText(/J’ai lu la charte des données personnelles/))

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

      const passwordInput = screen.getByPlaceholderText('Ton mot de passe')
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

      await user.press(screen.getByText(/J’ai lu la charte des données personnelles/))

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

    const passwordInput = screen.getByPlaceholderText('Ton mot de passe')
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

    await user.press(screen.getByText(/J’ai lu la charte des données personnelles/))

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

      const passwordInput = screen.getByPlaceholderText('Ton mot de passe')
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

      await user.press(screen.getByText(/J’ai lu la charte des données personnelles/))

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

      await screen.findAllByText('Mot de passe')

      await user.press(screen.getByText('Quitter'))
      await user.press(screen.getByText('Abandonner l’inscription'))

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

      await renderSignupForm()

      const emailInput = screen.getByTestId('Entrée pour l’email')
      await user.type(emailInput, 'email@gmail.com')

      await user.press(screen.getByLabelText('Continuer vers l’étape Mot de passe'))

      const passwordInput = screen.getByPlaceholderText('Ton mot de passe')
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
      await user.press(screen.getByText(/J’ai lu la charte des données personnelles/))

      await user.press(screen.getByText('S’inscrire'))

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
            resolution: '750x1334',
            screenZoomLevel: undefined,
            fontScale: -1,
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

      const passwordInput = screen.getByPlaceholderText('Ton mot de passe')
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

      await user.press(screen.getByText(/J’ai lu la charte des données personnelles/))

      await user.press(screen.getByText('S’inscrire'))

      expect(eventMonitoring.captureException).toHaveBeenCalledWith(
        new ApiError(400, '', 'Échec de la requête https://localhost/native/v1/account, code: 400')
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
      setFeatureFlags([RemoteStoreFeatureFlags.WIP_ENABLE_GOOGLE_SSO])
    })

    it('should sign in when sso button is clicked and sso account already exists', async () => {
      getModelSpy.mockReturnValueOnce('iPhone 13')
      getSystemNameSpy.mockReturnValueOnce('iOS')
      mockServer.postApi<SigninResponse>('/v1/oauth/google/authorize', {
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
        accountState: AccountState.ACTIVE,
      })
      mockServer.getApi<UserProfileResponseWithoutSurvey>('/v1/me', beneficiaryUser)

      await renderSignupForm()
      await screen.findByText('Inscription')

      await pressSSOButton()

      expect(apiPostGoogleAuthorize).toHaveBeenCalledWith({
        authorizationCode: 'mockServerAuthCode',
        oauthStateToken: 'oauth_state_token',
        deviceInfo: {
          deviceId: 'ad7b7b5a169641e27cadbdb35adad9c4ca23099a',
          os: 'iOS',
          source: 'iPhone 13',
          resolution: '750x1334',
          screenZoomLevel: undefined,
          fontScale: -1,
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

      await renderSignupForm()
      await screen.findByText('Inscription')

      await waitFor(() => pressSSOButton())

      expect(screen.getByText('Renseigne ta date de naissance')).toBeOnTheScreen()
    })

    it('should go back to email step instead of password step when signing up with sso button', async () => {
      mockServer.postApi<SignInResponseFailure['content']>('/v1/oauth/google/authorize', {
        responseOptions: {
          statusCode: 401,
          data: signInFailureData,
        },
      })
      await renderSignupForm()

      await user.press(await screen.findByTestId('S’inscrire avec Google'))

      await user.press(screen.getByTestId('Revenir en arrière'))

      expect(screen.getByText('Crée-toi un compte')).toBeOnTheScreen()
    })

    it('should display go back for last step', async () => {
      mockServer.postApi<SignInResponseFailure['content']>('/v1/oauth/google/authorize', {
        responseOptions: {
          statusCode: 401,
          data: signInFailureData,
        },
      })

      await renderSignupForm()
      await screen.findByText('Inscription')

      await waitFor(() => pressSSOButton())

      const datePicker = screen.getByTestId('date-picker-spinner-native')
      await act(async () =>
        fireEvent(datePicker, 'onChange', { nativeEvent: { timestamp: ELIGIBLE_AGE_DATE } })
      )
      await user.press(screen.getByText('Continuer'))

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

      await renderSignupForm()

      await user.press(await screen.findByTestId('S’inscrire avec Google'))

      await user.press(screen.getByTestId('Revenir en arrière'))

      const emailInput = screen.getByTestId('Entrée pour l’email')
      await user.type(emailInput, 'email@gmail.com')
      await user.press(screen.getByText('Continuer'))

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

      await renderSignupForm()
      await screen.findByText('Inscription')

      await waitFor(() => pressSSOButton())

      let datePicker: ReactTestInstance
      await waitFor(async () => {
        datePicker = await screen.findByTestId('date-picker-spinner-native')
      })
      await act(async () =>
        fireEvent(datePicker, 'onChange', { nativeEvent: { timestamp: ELIGIBLE_AGE_DATE } })
      )
      await user.press(screen.getByText('Continuer'))
      await user.press(
        screen.getByText(/J’ai lu et j’accepte les conditions générales d’utilisation/)
      )

      await user.press(screen.getByText(/J’ai lu la charte des données personnelles/))

      await user.press(screen.getByText('S’inscrire'))

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
            resolution: '750x1334',
            screenZoomLevel: undefined,
            fontScale: -1,
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

      await renderSignupForm()

      const ssoButton = await screen.findByTestId('S’inscrire avec Google')

      await waitFor(async () => {
        expect(ssoButton.props.focusable).toBeTruthy()
      })

      await user.press(ssoButton)

      const datePicker = screen.getByTestId('date-picker-spinner-native')
      await act(async () =>
        fireEvent(datePicker, 'onChange', { nativeEvent: { timestamp: ELIGIBLE_AGE_DATE } })
      )
      await user.press(screen.getByText('Continuer'))
      await user.press(
        screen.getByText(/J’ai lu et j’accepte les conditions générales d’utilisation/)
      )

      await user.press(screen.getByText(/J’ai lu la charte des données personnelles/))

      await user.press(screen.getByText('S’inscrire'))

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

      await renderSignupForm()

      const datePicker = screen.getByTestId('date-picker-spinner-native')
      await act(async () =>
        fireEvent(datePicker, 'onChange', { nativeEvent: { timestamp: ELIGIBLE_AGE_DATE } })
      )
      await user.press(screen.getByText('Continuer'))
      await user.press(
        screen.getByText(/J’ai lu et j’accepte les conditions générales d’utilisation/)
      )

      await user.press(screen.getByText(/J’ai lu la charte des données personnelles/))

      await user.press(screen.getByText('S’inscrire'))

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

      await renderSignupForm()

      expect(await screen.findByText('Renseigne ta date de naissance')).toBeOnTheScreen()
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

      await renderSignupForm()

      let datePicker: ReactTestInstance
      await waitFor(async () => {
        datePicker = await screen.findByTestId('date-picker-spinner-native')
      })
      await act(async () =>
        fireEvent(datePicker, 'onChange', { nativeEvent: { timestamp: ELIGIBLE_AGE_DATE } })
      )
      await user.press(screen.getByText('Continuer'))
      await user.press(
        screen.getByText(/J’ai lu et j’accepte les conditions générales d’utilisation/)
      )

      await user.press(screen.getByText(/J’ai lu la charte des données personnelles/))

      await user.press(screen.getByText('S’inscrire'))

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
            resolution: '750x1334',
            screenZoomLevel: undefined,
            fontScale: -1,
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

        await renderSignupForm()

        expect(analytics.logStepperDisplayed).toHaveBeenNthCalledWith(
          1,
          StepperOrigin.HOME,
          PreValidationSignupStep.Email,
          undefined
        )

        await waitFor(() => pressSSOButton())

        expect(analytics.logStepperDisplayed).toHaveBeenNthCalledWith(
          2,
          StepperOrigin.HOME,
          PreValidationSignupStep.Birthday,
          'SSO_signup'
        )

        const datePicker = screen.getByTestId('date-picker-spinner-native')
        await act(async () => {
          fireEvent(datePicker, 'onChange', { nativeEvent: { timestamp: ELIGIBLE_AGE_DATE } })
        })

        await user.press(screen.getByTestId('Continuer vers l’étape CGU & Données'))

        await waitFor(() =>
          expect(analytics.logStepperDisplayed).toHaveBeenNthCalledWith(
            3,
            StepperOrigin.HOME,
            PreValidationSignupStep.CGU,
            'SSO_signup'
          )
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

        await renderSignupForm()

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

        await user.press(screen.getByTestId('Continuer vers l’étape CGU & Données'))

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

const renderSignupForm = () => renderAsync(reactQueryProviderHOC(<SignupForm />))

const pressSSOButton = async () => {
  const SSOButton = await screen.findByTestId('S’inscrire avec Google')
  await waitForButtonToBePressable(SSOButton)
  await user.press(SSOButton)
}
