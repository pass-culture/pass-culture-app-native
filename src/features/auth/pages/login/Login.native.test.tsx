// eslint-disable-next-line no-restricted-imports
import React from 'react'
import DeviceInfo from 'react-native-device-info'

import { BatchUser } from '__mocks__/@batch.com/react-native-plugin'
import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import * as API from 'api/api'
import {
  AccountState,
  FavoriteResponse,
  OauthStateResponse,
  SigninResponse,
  UserProfileResponse,
} from 'api/gen'
import { AuthContext } from 'features/auth/context/AuthContext'
import * as SettingsContextAPI from 'features/auth/context/SettingsContext'
import { defaultSettings } from 'features/auth/fixtures/fixtures'
import { SignInResponseFailure } from 'features/auth/types'
import { favoriteOfferResponseSnap } from 'features/favorites/fixtures/favoriteOfferResponseSnap'
import { favoriteResponseSnap } from 'features/favorites/fixtures/favoriteResponseSnap'
import { navigateToHome } from 'features/navigation/helpers/navigateToHome'
import { usePreviousRoute } from 'features/navigation/helpers/usePreviousRoute'
import { StepperOrigin } from 'features/navigation/RootNavigator/types'
import { FAKE_USER_ID } from 'fixtures/fakeUserId'
import { beneficiaryUser } from 'fixtures/user'
import { analytics } from 'libs/analytics'
// eslint-disable-next-line no-restricted-imports
import { firebaseAnalytics } from 'libs/firebase/analytics'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { captureMonitoringError } from 'libs/monitoring'
import { NetworkErrorFixture, UnknownErrorFixture } from 'libs/recaptcha/fixtures'
import { storage } from 'libs/storage'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen, simulateWebviewMessage } from 'tests/utils'
import { SUGGESTION_DELAY_IN_MS } from 'ui/components/inputs/EmailInputWithSpellingHelp/useEmailSpellingHelp'
import { SNACK_BAR_TIME_OUT_LONG } from 'ui/components/snackBar/SnackBarContext'

import { Login } from './Login'

const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

jest.mock('libs/monitoring')
jest.mock('libs/react-native-device-info/getDeviceId')
jest.mock('features/navigation/helpers/navigateToHome')
jest.mock('features/navigation/helpers/usePreviousRoute')
const mockResetSearch = jest.fn()
const mockIdentityCheckDispatch = jest.fn()
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: jest.fn(() => ({ resetSearch: mockResetSearch })),
}))
jest.mock('features/identityCheck/context/SubscriptionContextProvider', () => ({
  useSubscriptionContext: jest.fn(() => ({ dispatch: mockIdentityCheckDispatch })),
}))

const mockShowErrorSnackBar = jest.fn()
const mockShowInfoSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showErrorSnackBar: mockShowErrorSnackBar,
    showInfoSnackBar: mockShowInfoSnackBar,
  }),
}))

const mockUsePreviousRoute = usePreviousRoute as jest.Mock

const apiPostFavoriteSpy = jest.spyOn(API.api, 'postNativeV1MeFavorites')

const apiSignInSpy = jest.spyOn(API.api, 'postNativeV1Signin')
const apiPostGoogleAuthorize = jest.spyOn(API.api, 'postNativeV1OauthGoogleAuthorize')
const getModelSpy = jest.spyOn(DeviceInfo, 'getModel')
const getSystemNameSpy = jest.spyOn(DeviceInfo, 'getSystemName')

jest.useFakeTimers()

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('<Login/>', () => {
  beforeEach(() => {
    activateFeatureFlags([RemoteStoreFeatureFlags.WIP_ENABLE_GOOGLE_SSO])
    mockServer.postApi<FavoriteResponse>('/v1/me/favorites', favoriteResponseSnap)
    mockServer.getApi<OauthStateResponse>('/v1/oauth/state', {
      oauthStateToken: 'oauth_state_token',
    })
    simulateSignin200(AccountState.ACTIVE)
    mockMeApiCall({
      needsToFillCulturalSurvey: false,
      showEligibleCard: false,
    } as UserProfileResponse)
    mockUsePreviousRoute.mockReturnValue(null)
  })

  afterEach(async () => {
    await storage.clear('has_seen_eligible_card')
  })

  it('should render correctly when feature flag is enabled', async () => {
    renderLogin()

    await screen.findByText('Connecte-toi')

    expect(screen).toMatchSnapshot()
  })

  it('should sign in when "Se connecter" is clicked with device info', async () => {
    getModelSpy.mockReturnValueOnce('iPhone 13')
    getSystemNameSpy.mockReturnValueOnce('iOS')
    renderLogin()
    await screen.findByText('Connecte-toi')

    await fillInputs()
    await act(() => fireEvent.press(screen.getByText('Se connecter')))

    expect(apiSignInSpy).toHaveBeenCalledWith(
      {
        identifier: 'email@gmail.com',
        password: 'user@AZERTY123',
        deviceInfo: {
          deviceId: 'ad7b7b5a169641e27cadbdb35adad9c4ca23099a',
          os: 'iOS',
          source: 'iPhone 13',
        },
      },
      { credentials: 'omit' }
    )
  })

  it('should sign in when SSO button is clicked with device info', async () => {
    getModelSpy.mockReturnValueOnce('iPhone 13')
    getSystemNameSpy.mockReturnValueOnce('iOS')
    mockServer.postApi<SigninResponse>('/v1/oauth/google/authorize', {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
      accountState: AccountState.ACTIVE,
    })

    renderLogin()

    await act(async () => fireEvent.press(await screen.findByTestId('Se connecter avec Google')))

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

  it('should show snackbar when SSO login fails because account is invalid', async () => {
    mockServer.postApi<SignInResponseFailure['content']>('/v1/oauth/google/authorize', {
      responseOptions: {
        statusCode: 400,
        data: {
          code: 'SSO_ACCOUNT_DELETED',
          general: [],
        },
      },
    })

    renderLogin()

    await act(async () => fireEvent.press(await screen.findByTestId('Se connecter avec Google')))

    expect(mockShowErrorSnackBar).toHaveBeenCalledWith({
      message:
        'Ton compte Google semble ne pas être valide. Pour pouvoir te connecter, confirme d’abord ton adresse e-mail Google.',
      timeout: SNACK_BAR_TIME_OUT_LONG,
    })
  })

  it('should redirect to signup form when SSO login fails because user does not exist', async () => {
    mockServer.postApi<SignInResponseFailure['content']>('/v1/oauth/google/authorize', {
      responseOptions: {
        statusCode: 401,
        data: {
          code: 'SSO_EMAIL_NOT_FOUND',
          general: [],
          accountCreationToken: 'accountCreationToken',
          email: 'user@gmail.com',
        },
      },
    })

    renderLogin()

    await act(async () => fireEvent.press(await screen.findByTestId('Se connecter avec Google')))

    expect(navigate).toHaveBeenCalledWith('SignupForm', {
      accountCreationToken: 'accountCreationToken',
      email: 'user@gmail.com',
      from: StepperOrigin.LOGIN,
    })
  })

  it('should display suggestion with a corrected email when the email is mistyped', async () => {
    renderLogin()

    await act(async () => {
      const emailInput = screen.getByPlaceholderText('tonadresse@email.com')
      fireEvent.changeText(emailInput, 'john.doe@gmal.com')
    })

    await act(async () => {
      jest.advanceTimersByTime(SUGGESTION_DELAY_IN_MS)
    })

    expect(screen.getByText('Veux-tu plutôt dire john.doe@gmail.com\u00a0?')).toBeOnTheScreen()
  })

  it('should not open reCAPTCHA challenge modal when clicking on login button when feature flag is disabled', async () => {
    renderLogin()
    const recaptchaWebviewModal = screen.queryByTestId('recaptcha-webview-modal')

    await fillInputs()
    await act(() => fireEvent.press(screen.getByText('Se connecter')))

    expect(recaptchaWebviewModal).not.toBeOnTheScreen()
  })

  it('should redirect to home WHEN signin is successful', async () => {
    renderLogin()

    await fillInputs()
    await act(() => fireEvent.press(screen.getByText('Se connecter')))

    expect(BatchUser.editor().setIdentifier).toHaveBeenCalledWith(FAKE_USER_ID.toString())
    expect(firebaseAnalytics.setUserId).toHaveBeenCalledWith(FAKE_USER_ID)
    expect(navigateToHome).toHaveBeenCalledTimes(1)
    expect(mockResetSearch).toHaveBeenCalledTimes(1)
    expect(mockIdentityCheckDispatch).toHaveBeenNthCalledWith(1, { type: 'INIT' })
  })

  it('should redirect to NATIVE Cultural Survey WHEN signin is successful and user needs to fill cultural survey', async () => {
    activateFeatureFlags([RemoteStoreFeatureFlags.WIP_ENABLE_GOOGLE_SSO])
    activateFeatureFlags() // disabled ENABLE_CULTURAL_SURVEY_MANDATORY feature flag

    mockMeApiCall({
      ...beneficiaryUser,
      needsToFillCulturalSurvey: true,
      showEligibleCard: false,
    } as UserProfileResponse)
    renderLogin()

    await fillInputs()
    await act(() => fireEvent.press(screen.getByText('Se connecter')))

    expect(navigate).toHaveBeenNthCalledWith(1, 'CulturalSurveyIntro')
  })

  it('should redirect to home WHEN signin is successful and ENABLE_CULTURAL_SURVEY_MANDATORY enabled', async () => {
    activateFeatureFlags([RemoteStoreFeatureFlags.WIP_ENABLE_GOOGLE_SSO])
    activateFeatureFlags([RemoteStoreFeatureFlags.ENABLE_CULTURAL_SURVEY_MANDATORY])
    mockMeApiCall({
      needsToFillCulturalSurvey: true,
      showEligibleCard: false,
    } as UserProfileResponse)
    renderLogin()

    await fillInputs()
    await act(() => fireEvent.press(screen.getByText('Se connecter')))

    expect(navigateToHome).toHaveBeenCalledTimes(1)
  })

  it('should not redirect to EighteenBirthday WHEN signin is successful and user has already seen eligible card and needs to see it', async () => {
    storage.saveObject('has_seen_eligible_card', true)
    mockMeApiCall({
      needsToFillCulturalSurvey: false,
      showEligibleCard: true,
    } as UserProfileResponse)
    renderLogin()

    await fillInputs()
    await act(() => fireEvent.press(screen.getByText('Se connecter')))

    expect(navigateToHome).toHaveBeenCalledTimes(1)
  })

  it('should redirect to EighteenBirthday WHEN signin is successful and user has not seen eligible card and needs to see it', async () => {
    mockMeApiCall({
      needsToFillCulturalSurvey: true,
      showEligibleCard: true,
    } as UserProfileResponse)
    renderLogin()

    await fillInputs()
    await act(() => fireEvent.press(screen.getByText('Se connecter')))

    expect(navigate).toHaveBeenCalledWith('EighteenBirthday')
  })

  it('should redirect to RecreditBirthdayNotification WHEN signin is successful and user has recreditAmountToShow not null', async () => {
    mockMeApiCall({
      needsToFillCulturalSurvey: true,
      showEligibleCard: true,
      recreditAmountToShow: 3000,
    } as UserProfileResponse)
    renderLogin()

    await fillInputs()
    await act(() => fireEvent.press(screen.getByText('Se connecter')))

    expect(navigate).toHaveBeenNthCalledWith(1, 'RecreditBirthdayNotification')
  })

  it('should not redirect to RecreditBirthdayNotification WHEN signin is successful and user has recreditAmountToShow to null', async () => {
    mockMeApiCall({
      needsToFillCulturalSurvey: true,
      showEligibleCard: true,
      recreditAmountToShow: null,
    } as UserProfileResponse)
    renderLogin()

    await fillInputs()
    await act(() => fireEvent.press(screen.getByText('Se connecter')))

    expect(navigate).toHaveBeenCalledWith('EighteenBirthday')
  })

  it('should redirect to SignupConfirmationEmailSent page WHEN signin has failed with EMAIL_NOT_VALIDATED code', async () => {
    simulateSigninEmailNotValidated()
    renderLogin()

    await fillInputs()
    await act(() => fireEvent.press(screen.getByText('Se connecter')))

    expect(navigate).toHaveBeenNthCalledWith(1, 'SignupConfirmationEmailSent', {
      email: 'email@gmail.com',
    })
  })

  it('should redirect to AccountStatusScreenHandler WHEN signin is successful for inactive account', async () => {
    simulateSignin200(AccountState.INACTIVE)
    renderLogin()

    await fillInputs()
    await act(() => fireEvent.press(screen.getByText('Se connecter')))

    expect(navigate).toHaveBeenNthCalledWith(1, 'AccountStatusScreenHandler')
  })

  it('should redirect to AccountStatusScreenHandler WHEN signin is successful for suspended account', async () => {
    simulateSignin200(AccountState.SUSPENDED)
    renderLogin()

    await fillInputs()
    await act(() => fireEvent.press(screen.getByText('Se connecter')))

    expect(navigate).toHaveBeenNthCalledWith(1, 'AccountStatusScreenHandler')
  })

  it('should redirect to AccountStatusScreenHandler WHEN signin is successful for suspended account upon user request', async () => {
    simulateSignin200(AccountState.SUSPENDED_UPON_USER_REQUEST)
    renderLogin()

    await fillInputs()
    await act(() => fireEvent.press(screen.getByText('Se connecter')))

    expect(navigate).toHaveBeenNthCalledWith(1, 'AccountStatusScreenHandler')
  })

  it('should redirect to AccountStatusScreenHandler WHEN signin is successful for suspended account suspicious login report by user', async () => {
    simulateSignin200(AccountState.SUSPENDED_UPON_USER_REQUEST)
    renderLogin()

    await fillInputs()
    await act(() => fireEvent.press(screen.getByText('Se connecter')))

    expect(navigate).toHaveBeenNthCalledWith(1, 'AccountStatusScreenHandler')
  })

  it('should redirect to AccountStatusScreenHandler WHEN signin is successful for waiting for anonymization account', async () => {
    simulateSignin200(AccountState.WAITING_FOR_ANONYMIZATION)
    renderLogin()

    await fillInputs()
    await act(() => fireEvent.press(screen.getByText('Se connecter')))

    expect(navigate).toHaveBeenNthCalledWith(1, 'AccountStatusScreenHandler')
  })

  it('should show appropriate message if account is deleted', async () => {
    simulateSignin200(AccountState.DELETED)
    renderLogin()

    await fillInputs()
    await act(() => fireEvent.press(screen.getByText('Se connecter')))

    const errorMessage = screen.getByText('Ton compte à été supprimé')

    expect(errorMessage).toBeTruthy()
  })

  it('should show appropriate message if account is anonymized', async () => {
    simulateSignin200(AccountState.ANONYMIZED)
    renderLogin()

    await fillInputs()
    await act(() => fireEvent.press(screen.getByText('Se connecter')))

    const errorMessage = screen.getByText('Ton compte à été supprimé')

    expect(errorMessage).toBeTruthy()
  })

  it('should show email error message WHEN invalid e-mail format', async () => {
    renderLogin()

    const emailInput = screen.getByPlaceholderText('tonadresse@email.com')

    fireEvent.changeText(emailInput, 'not_valid_email@gmail')
    fireEvent(emailInput, 'onBlur')

    expect(
      await screen.findByText(
        'L’e-mail renseigné est incorrect. Exemple de format attendu : edith.piaf@email.fr'
      )
    ).toBeOnTheScreen()
  })

  it('should show error message and error inputs WHEN signin has failed because of wrong credentials', async () => {
    simulateSigninWrongCredentials()
    renderLogin()

    await fillInputs()
    await act(() => fireEvent.press(screen.getByText('Se connecter')))

    expect(screen.getByText('E-mail ou mot de passe incorrect')).toBeOnTheScreen()
    expect(navigate).not.toHaveBeenCalled()
  })

  it('should show error message and error inputs WHEN signin has failed because of network failure', async () => {
    // With msw when we make a request that fails because of network error, it raises an error on the console
    // We want to have this error to test if we catch this error correctly
    jest.spyOn(global.console, 'error').mockImplementationOnce(() => null)
    simulateSigninNetworkFailure()
    renderLogin()

    await fillInputs()
    await act(() => fireEvent.press(screen.getByText('Se connecter')))

    expect(
      screen.getByText('Erreur réseau. Tu peux réessayer une fois la connexion réétablie')
    ).toBeOnTheScreen()
    expect(navigate).not.toHaveBeenCalled()
  })

  it('should show specific error message when signin rate limit is exceeded', async () => {
    simulateSigninRateLimitExceeded()
    renderLogin()

    await fillInputs()
    await act(() => fireEvent.press(screen.getByText('Se connecter')))

    expect(
      screen.getByText('Nombre de tentatives dépassé. Réessaye dans 1 minute')
    ).toBeOnTheScreen()
    expect(navigate).not.toHaveBeenCalled()
  })

  it('should enable login button when both text inputs are filled', async () => {
    renderLogin()
    await screen.findByText('Connecte-toi')

    await fillInputs()

    const connectedButton = screen.getByText('Se connecter')

    expect(connectedButton).toBeEnabled()
  })

  it('should log analytics on render', async () => {
    useRoute.mockReturnValueOnce({ params: { from: StepperOrigin.PROFILE } })
    renderLogin()

    await screen.findByText('Connecte-toi')

    expect(analytics.logStepperDisplayed).toHaveBeenNthCalledWith(1, StepperOrigin.PROFILE, 'Login')
  })

  it('should log analytics when clicking on "Créer un compte" button', async () => {
    renderLogin()

    const signupButton = screen.getByText('Créer un compte')
    await act(async () => {
      fireEvent.press(signupButton)
    })

    expect(analytics.logSignUpClicked).toHaveBeenNthCalledWith(1, { from: 'login' })
  })

  it('should log analytics when signing in', async () => {
    renderLogin()
    await screen.findByText('Connecte-toi')

    await fillInputs()
    await act(() => fireEvent.press(screen.getByText('Se connecter')))

    expect(analytics.logLogin).toHaveBeenCalledWith({ method: 'fromLogin', type: undefined })
  })

  it('should log analytics when signing in with SSO', async () => {
    mockServer.postApi<SigninResponse>('/v1/oauth/google/authorize', {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
      accountState: AccountState.ACTIVE,
    })

    renderLogin()

    await act(async () => fireEvent.press(await screen.findByTestId('Se connecter avec Google')))

    expect(analytics.logLogin).toHaveBeenCalledWith({ method: 'fromLogin', type: 'SSO_login' })
  })

  it('should display forced login help message when the query param is given', async () => {
    useRoute.mockReturnValueOnce({ params: { displayForcedLoginHelpMessage: true } })
    renderLogin()

    await screen.findByText('Connecte-toi')

    expect(mockShowInfoSnackBar).toHaveBeenCalledWith({
      message: 'Pour sécuriser ton pass Culture, tu dois régulièrement confirmer tes identifiants.',
      timeout: SNACK_BAR_TIME_OUT_LONG,
    })
  })

  it('should log analytics when displaying forced login help message', async () => {
    useRoute.mockReturnValueOnce({ params: { displayForcedLoginHelpMessage: true } })
    renderLogin()

    await screen.findByText('Connecte-toi')

    expect(analytics.logDisplayForcedLoginHelpMessage).toHaveBeenCalledTimes(1)
  })

  it('should not display the login help message when the query param is not given', async () => {
    renderLogin()

    await screen.findByText('Connecte-toi')

    expect(mockShowInfoSnackBar).not.toHaveBeenCalled()
  })

  describe('Login comes from adding an offer to favorite', () => {
    const OFFER_ID = favoriteResponseSnap.offer.id

    beforeEach(() => {
      useRoute.mockReturnValue({ params: { offerId: OFFER_ID, from: StepperOrigin.FAVORITE } }) // first render
    })

    it('should redirect to Offer page when signin is successful', async () => {
      renderLogin()
      await fillInputs()
      await act(async () => {
        fireEvent.press(screen.getByText('Se connecter'))
      })

      expect(navigate).toHaveBeenNthCalledWith(1, 'Offer', {
        id: OFFER_ID,
      })
    })

    it('should add the previous offer to favorites when signin is successful', async () => {
      simulateAddToFavorites()

      renderLogin()
      await fillInputs()
      await act(async () => {
        fireEvent.press(screen.getByText('Se connecter'))
      })

      expect(apiPostFavoriteSpy).toHaveBeenCalledTimes(1)
    })

    it('should log analytics when adding the previous offer to favorites', async () => {
      simulateAddToFavorites()
      renderLogin()

      await fillInputs()
      await act(async () => {
        fireEvent.press(screen.getByText('Se connecter'))
      })

      expect(analytics.logHasAddedOfferToFavorites).toHaveBeenCalledWith({
        from: 'login',
        offerId: OFFER_ID,
      })
    })

    it('should redirect to CulturalSurveyIntro instead of Offer when user needs to fill it', async () => {
      mockMeApiCall({
        ...beneficiaryUser,
        needsToFillCulturalSurvey: true,
        showEligibleCard: false,
      } as UserProfileResponse)
      renderLogin()

      await fillInputs()
      await act(async () => {
        fireEvent.press(screen.getByText('Se connecter'))
      })

      expect(navigate).toHaveBeenCalledWith('CulturalSurveyIntro')
    })
  })

  describe('Login from offer booking modal', () => {
    const OFFER_ID = favoriteOfferResponseSnap.id

    beforeEach(() => {
      useRoute.mockReturnValue({ params: { offerId: OFFER_ID, from: StepperOrigin.BOOKING } }) // first render
    })

    it('should redirect to the previous offer page and ask to open the booking modal', async () => {
      renderLogin()

      await fillInputs()
      await act(async () => {
        fireEvent.press(screen.getByText('Se connecter'))
      })

      expect(navigate).toHaveBeenNthCalledWith(1, 'Offer', {
        id: OFFER_ID,
        openModalOnNavigation: true,
      })
    })
  })

  describe('Login with ReCatpcha', () => {
    beforeAll(() => {
      return jest
        .spyOn(SettingsContextAPI, 'useSettingsContext')
        .mockReturnValue({ data: defaultSettings, isLoading: false })
    })

    it('should not open reCAPTCHA challenge modal before clicking on login button', async () => {
      renderLogin()
      const recaptchaWebviewModal = screen.getByTestId('recaptcha-webview-modal')

      await fillInputs()

      expect(recaptchaWebviewModal.props.visible).toBe(false)
    })

    it('should open reCAPTCHA challenge modal when clicking on login button', async () => {
      renderLogin()
      const recaptchaWebviewModal = screen.getByTestId('recaptcha-webview-modal')

      await fillInputs()
      await act(() => fireEvent.press(screen.getByText('Se connecter')))

      expect(recaptchaWebviewModal.props.visible).toBe(true)
    })

    it('should disable login button when starting reCAPTCHA challenge', async () => {
      renderLogin()

      await fillInputs()
      await act(() => fireEvent.press(screen.getByText('Se connecter')))

      expect(screen.getByText('Se connecter')).toBeDisabled()
    })

    it('should login user when reCAPTCHA challenge is successful', async () => {
      renderLogin()

      await fillInputs()
      await act(() => fireEvent.press(screen.getByText('Se connecter')))

      const recaptchaWebview = screen.getByTestId('recaptcha-webview')
      await simulateWebviewMessage(
        recaptchaWebview,
        '{ "message": "success", "token": "fakeToken" }'
      )

      expect(apiSignInSpy).toHaveBeenCalledWith(
        {
          identifier: 'email@gmail.com',
          password: 'user@AZERTY123',
          token: 'fakeToken',
          deviceInfo: {
            deviceId: 'ad7b7b5a169641e27cadbdb35adad9c4ca23099a',
            os: 'unknown',
            source: 'none',
          },
        },
        { credentials: 'omit' }
      )
    })

    it('should display error message on reCAPTCHA failure', async () => {
      renderLogin()

      await fillInputs()
      await act(() => fireEvent.press(screen.getByText('Se connecter')))

      const recaptchaWebview = screen.getByTestId('recaptcha-webview')
      await simulateWebviewMessage(recaptchaWebview, UnknownErrorFixture)

      expect(screen.getByText('Un problème est survenu, réessaie plus tard.')).toBeOnTheScreen()
    })

    it('should not login user on reCAPTCHA failure', async () => {
      renderLogin()

      await fillInputs()
      await act(() => fireEvent.press(screen.getByText('Se connecter')))

      const recaptchaWebview = screen.getByTestId('recaptcha-webview')
      await simulateWebviewMessage(recaptchaWebview, UnknownErrorFixture)

      expect(apiSignInSpy).not.toHaveBeenCalled()
    })

    it('should log to Sentry on reCAPTCHA failure', async () => {
      renderLogin()

      await fillInputs()
      await act(() => fireEvent.press(screen.getByText('Se connecter')))

      const recaptchaWebview = screen.getByTestId('recaptcha-webview')
      await simulateWebviewMessage(recaptchaWebview, UnknownErrorFixture)

      expect(captureMonitoringError).toHaveBeenCalledWith(
        'UnknownError someError',
        'LoginOnRecaptchaError'
      )
    })

    it('should not log to Sentry on reCAPTCHA network error', async () => {
      renderLogin()

      await fillInputs()
      await act(() => fireEvent.press(screen.getByText('Se connecter')))

      const recaptchaWebview = screen.getByTestId('recaptcha-webview')
      await simulateWebviewMessage(recaptchaWebview, NetworkErrorFixture)

      expect(captureMonitoringError).not.toHaveBeenCalled()
    })

    it('should precise when it is a network failure on reCAPTCHA failure', async () => {
      renderLogin()

      await fillInputs()
      await act(() => fireEvent.press(screen.getByText('Se connecter')))

      const recaptchaWebview = screen.getByTestId('recaptcha-webview')
      await simulateWebviewMessage(recaptchaWebview, NetworkErrorFixture)

      expect(
        screen.getByText(
          'Un problème est survenu, vérifie ta connexion internet avant de rééssayer.'
        )
      ).toBeOnTheScreen()
    })

    it('should display error message when reCAPTCHA token has expired', async () => {
      renderLogin()

      await fillInputs()
      await act(() => fireEvent.press(screen.getByText('Se connecter')))

      const recaptchaWebview = screen.getByTestId('recaptcha-webview')
      await simulateWebviewMessage(recaptchaWebview, '{ "message": "expire" }')

      expect(screen.getByText('Le token reCAPTCHA a expiré, tu peux réessayer.')).toBeOnTheScreen()
    })

    it('should not login user when reCAPTCHA token has expired', async () => {
      renderLogin()

      await fillInputs()
      await act(() => fireEvent.press(screen.getByText('Se connecter')))

      const recaptchaWebview = screen.getByTestId('recaptcha-webview')
      await simulateWebviewMessage(recaptchaWebview, '{ "message": "expire" }')

      expect(apiSignInSpy).not.toHaveBeenCalled()
    })

    it.each(['error', 'expire'])('should enable login button on reCAPTCHA %s', async (reason) => {
      renderLogin()

      await fillInputs()
      await act(() => fireEvent.press(screen.getByText('Se connecter')))

      const recaptchaWebview = screen.getByTestId('recaptcha-webview')
      await simulateWebviewMessage(recaptchaWebview, `{ "message": "${reason}" }`)

      expect(screen.queryByText('Se connecter')).toBeEnabled()
    })
  })
})

const fillInputs = async () => {
  const emailInput = screen.getByPlaceholderText('tonadresse@email.com')
  const passwordInput = screen.getByPlaceholderText('Ton mot de passe')
  fireEvent.changeText(emailInput, 'email@gmail.com')
  await act(async () => {
    fireEvent.changeText(passwordInput, 'user@AZERTY123')
  })
}

function renderLogin() {
  return render(
    reactQueryProviderHOC(
      <AuthContext.Provider
        value={{
          isLoggedIn: false,
          setIsLoggedIn: jest.fn(),
          isUserLoading: false,
          refetchUser: jest.fn(),
        }}>
        <Login />
      </AuthContext.Provider>
    )
  )
}

function mockMeApiCall(response: UserProfileResponse) {
  mockServer.getApi<UserProfileResponse>('/v1/me', response)
}

function simulateSignin200(accountState: AccountState) {
  mockServer.postApi<SigninResponse>('/v1/signin', {
    accessToken: 'accessToken',
    refreshToken: 'refreshToken',
    accountState,
  })
}

function simulateSigninWrongCredentials() {
  mockServer.postApi('/v1/signin', {
    responseOptions: {
      statusCode: 400,
      data: {
        general: ['Identifiant ou Mot de passe incorrect'],
      },
    },
  })
}

function simulateSigninRateLimitExceeded() {
  mockServer.postApi('/v1/signin', {
    responseOptions: {
      statusCode: 429,
      data: {
        general: ['Nombre de tentative de connexion dépassé. Veuillez réessayer dans 1 minute.'],
      },
    },
  })
}

function simulateSigninEmailNotValidated() {
  mockServer.postApi('/v1/signin', {
    responseOptions: {
      statusCode: 400,
      data: {
        code: 'EMAIL_NOT_VALIDATED',
        general: ['L’email n’a pas été validé.'],
      },
    },
  })
}

function simulateSigninNetworkFailure() {
  mockServer.postApi('/v1/signin', {
    responseOptions: {
      data: {
        code: 'NETWORK_REQUEST_FAILED',
        general: ['Erreur réseau. Tu peux réessayer une fois la connexion réétablie'],
      },
    },
  })
}

function simulateAddToFavorites() {
  mockServer.postApi<FavoriteResponse>('/v1/me/favorites', favoriteResponseSnap)
}

const activateFeatureFlags = (activeFeatureFlags: RemoteStoreFeatureFlags[] = []) => {
  useFeatureFlagSpy.mockImplementation((flag) => activeFeatureFlags.includes(flag))
}
