import React from 'react'
import DeviceInfo from 'react-native-device-info'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { FAKE_USER_ID } from '__mocks__/jwt-decode'
import { BatchUser } from '__mocks__/libs/react-native-batch'
import * as API from 'api/api'
import { AccountState, FavoriteResponse, SigninResponse, UserProfileResponse } from 'api/gen'
import { mockDefaultSettings } from 'features/auth/context/__mocks__/SettingsContext'
import { AuthContext } from 'features/auth/context/AuthContext'
import * as SettingsContextAPI from 'features/auth/context/SettingsContext'
import { favoriteOfferResponseSnap } from 'features/favorites/fixtures/favoriteOfferResponseSnap'
import { favoriteResponseSnap } from 'features/favorites/fixtures/favoriteResponseSnap'
import { usePreviousRoute, navigateToHome } from 'features/navigation/helpers'
import { analytics } from 'libs/analytics'
// eslint-disable-next-line no-restricted-imports
import { firebaseAnalytics } from 'libs/firebase/analytics'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { captureMonitoringError } from 'libs/monitoring'
import { NetworkErrorFixture, UnknownErrorFixture } from 'libs/recaptcha/fixtures'
import { storage } from 'libs/storage'
import { From } from 'shared/offer/enums'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, act, screen, simulateWebviewMessage } from 'tests/utils'
import { SUGGESTION_DELAY_IN_MS } from 'ui/components/inputs/EmailInputWithSpellingHelp/useEmailSpellingHelp'

import { Login } from './Login'

jest.mock('libs/monitoring')
jest.mock('features/navigation/helpers')
const mockSearchDispatch = jest.fn()
const mockIdentityCheckDispatch = jest.fn()
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: jest.fn(() => ({ dispatch: mockSearchDispatch })),
}))
jest.mock('features/identityCheck/context/SubscriptionContextProvider', () => ({
  useSubscriptionContext: jest.fn(() => ({ dispatch: mockIdentityCheckDispatch })),
}))

const mockUsePreviousRoute = usePreviousRoute as jest.Mock

const apiPostFavoriteSpy = jest.spyOn(API.api, 'postNativeV1MeFavorites')

const apiSignInSpy = jest.spyOn(API.api, 'postNativeV1Signin')
const getModelSpy = jest.spyOn(DeviceInfo, 'getModel')
const getSystemNameSpy = jest.spyOn(DeviceInfo, 'getSystemName')
const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)

jest.useFakeTimers({ legacyFakeTimers: true })

describe('<Login/>', () => {
  beforeEach(() => {
    mockServer.postApiV1<FavoriteResponse>('/me/favorites', favoriteResponseSnap)
  })

  it('should render correctly', async () => {
    mockUsePreviousRoute.mockReturnValueOnce(null)

    renderLogin()
    await act(() => {})

    expect(screen).toMatchSnapshot()
  })

  beforeEach(() => {
    mockServer.postApiV1<FavoriteResponse>('/me/favorites', favoriteResponseSnap)
    simulateSignin200()
    mockMeApiCall({
      needsToFillCulturalSurvey: false,
      showEligibleCard: false,
    } as UserProfileResponse)
    mockUsePreviousRoute.mockReturnValue(null)
  })

  afterEach(async () => {
    await storage.clear('has_seen_eligible_card')
  })

  it('should sign in when "Se connecter" is clicked with device info when feature flag is active', async () => {
    useFeatureFlagSpy.mockReturnValueOnce(true) // Mock for first render
    useFeatureFlagSpy.mockReturnValueOnce(true) // Mock for Auth Context rerender
    useFeatureFlagSpy.mockReturnValueOnce(true) // Mock for useDeviceInfo rerender
    useFeatureFlagSpy.mockReturnValueOnce(true) // Mock for email input rerender
    useFeatureFlagSpy.mockReturnValueOnce(true) // Mock for password input rerender
    useFeatureFlagSpy.mockReturnValueOnce(true) // Mock for error message rerender

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

  it('should display suggestion with a corrected email when the email is mistyped', async () => {
    renderLogin()

    await act(async () => {
      const emailInput = screen.getByPlaceholderText('tonadresse@email.com')
      fireEvent.changeText(emailInput, 'john.doe@gmal.com')
    })

    await act(async () => {
      jest.advanceTimersByTime(SUGGESTION_DELAY_IN_MS)
    })

    expect(screen.queryByText('Veux-tu plutôt dire john.doe@gmail.com\u00a0?')).toBeOnTheScreen()
  })

  it('should sign in when "Se connecter" is clicked without device info when feature flag is disabled', async () => {
    renderLogin()
    await screen.findByText('Connecte-toi')

    await fillInputs()
    await act(() => fireEvent.press(screen.getByText('Se connecter')))

    expect(apiSignInSpy).toHaveBeenCalledWith(
      {
        identifier: 'email@gmail.com',
        password: 'user@AZERTY123',
        deviceInfo: undefined,
      },
      { credentials: 'omit' }
    )
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
    expect(mockSearchDispatch).toHaveBeenNthCalledWith(1, { type: 'INIT' })
    expect(mockIdentityCheckDispatch).toHaveBeenNthCalledWith(1, { type: 'INIT' })
  })

  it('should redirect to NATIVE Cultural Survey WHEN signin is successful and user needs to fill cultural survey', async () => {
    mockMeApiCall({
      needsToFillCulturalSurvey: true,
      showEligibleCard: false,
    } as UserProfileResponse)
    renderLogin()

    await fillInputs()
    await act(() => fireEvent.press(screen.getByText('Se connecter')))

    expect(navigate).toHaveBeenCalledTimes(1)
    expect(navigate).toHaveBeenCalledWith('CulturalSurveyIntro')
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

  it('should redirect to SuspensionScreen WHEN signin is successful for inactive account', async () => {
    simulateSignin200(AccountState.INACTIVE)
    mockSuspensionStatusApiCall(AccountState.SUSPENDED)
    renderLogin()

    await fillInputs()
    await act(() => fireEvent.press(screen.getByText('Se connecter')))

    expect(navigate).toHaveBeenNthCalledWith(1, 'SuspensionScreen')
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
    simulateSigninNetworkFailure()
    renderLogin()

    await fillInputs()
    await act(() => fireEvent.press(screen.getByText('Se connecter')))

    expect(
      screen.queryByText('Erreur réseau. Tu peux réessayer une fois la connexion réétablie')
    ).toBeOnTheScreen()
    expect(navigate).not.toHaveBeenCalled()
  })

  it('should show specific error message when signin rate limit is exceeded', async () => {
    simulateSigninRateLimitExceeded()
    renderLogin()

    await fillInputs()
    await act(() => fireEvent.press(screen.getByText('Se connecter')))

    expect(
      screen.queryByText('Nombre de tentatives dépassé. Réessaye dans 1 minute')
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

  it('should log analytics when clicking on "Créer un compte" button', async () => {
    renderLogin()

    const signupButton = screen.getByText('Créer un compte')
    await act(async () => {
      fireEvent.press(signupButton)
    })

    expect(analytics.logSignUpClicked).toHaveBeenNthCalledWith(1, { from: 'login' })
  })

  describe('Login comes from adding an offer to favorite', () => {
    const OFFER_ID = favoriteResponseSnap.offer.id

    beforeEach(() => {
      useRoute.mockReturnValue({ params: { offerId: OFFER_ID, from: From.FAVORITE } }) // first render
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
      useRoute.mockReturnValue({ params: { offerId: OFFER_ID, from: From.BOOKING } }) // first render
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
        .mockReturnValue({ data: mockDefaultSettings, isLoading: false })
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
          deviceInfo: undefined,
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

      expect(screen.queryByText('Un problème est survenu, réessaie plus tard.')).toBeOnTheScreen()
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

    it('should display error message when reCAPTCHA token has expired', async () => {
      renderLogin()

      await fillInputs()
      await act(() => fireEvent.press(screen.getByText('Se connecter')))

      const recaptchaWebview = screen.getByTestId('recaptcha-webview')
      await simulateWebviewMessage(recaptchaWebview, '{ "message": "expire" }')

      expect(
        screen.queryByText('Le token reCAPTCHA a expiré, tu peux réessayer.')
      ).toBeOnTheScreen()
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
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
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
  mockServer.getApiV1<UserProfileResponse>('/me', response)
}

function mockSuspensionStatusApiCall(status: string) {
  mockServer.getApiV1('/account/suspension_status', status)
}

function simulateSignin200(accountState = AccountState.ACTIVE) {
  mockServer.postApiV1<SigninResponse>('/signin', {
    accessToken: 'accessToken',
    refreshToken: 'refreshToken',
    accountState,
  })
}

function simulateSigninWrongCredentials() {
  mockServer.postApiV1('/signin', {
    responseOptions: {
      statusCode: 400,
      data: {
        general: ['Identifiant ou Mot de passe incorrect'],
      },
    },
  })
}

function simulateSigninRateLimitExceeded() {
  mockServer.postApiV1('/signin', {
    responseOptions: {
      statusCode: 429,
      data: {
        general: ['Nombre de tentative de connexion dépassé. Veuillez réessayer dans 1 minute.'],
      },
    },
  })
}

function simulateSigninEmailNotValidated() {
  mockServer.postApiV1('/signin', {
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
  mockServer.postApiV1('/signin', {
    responseOptions: {
      statusCode: 'network-error',
      data: 'Network request failed',
    },
  })
}

function simulateAddToFavorites() {
  mockServer.postApiV1<FavoriteResponse>('/me/favorites', favoriteResponseSnap)
}
