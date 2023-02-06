import { rest } from 'msw'
import React from 'react'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { FAKE_USER_ID } from '__mocks__/jwt-decode'
import { BatchUser } from '__mocks__/libs/react-native-batch'
import { AccountState, SigninRequest, SigninResponse, UserProfileResponse } from 'api/gen'
import { AuthContext } from 'features/auth/context/AuthContext'
import { favoriteOfferResponseSnap } from 'features/favorites/fixtures/favoriteOfferResponseSnap'
import { favoriteResponseSnap } from 'features/favorites/fixtures/favoriteResponseSnap'
import { usePreviousRoute, navigateToHome } from 'features/navigation/helpers'
import { From } from 'features/offer/components/AuthenticationModal/fromEnum'
import { env } from 'libs/environment'
import { EmptyResponse } from 'libs/fetch'
import { analytics } from 'libs/firebase/analytics'
import { storage } from 'libs/storage'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { fireEvent, render, act, waitFor } from 'tests/utils'

import { Login } from './Login'

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

const mockPostFavorite = jest.fn()

describe('<Login/>', () => {
  beforeEach(() => {
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

  it('should redirect to home WHEN signin is successful', async () => {
    const renderAPI = renderLogin()

    fillInputs(renderAPI)
    fireEvent.press(renderAPI.getByText('Se connecter'))

    await waitFor(() => {
      expect(BatchUser.editor().setIdentifier).toHaveBeenCalledWith(FAKE_USER_ID.toString())
      expect(analytics.setUserId).toHaveBeenCalledWith(FAKE_USER_ID)
      expect(navigateToHome).toHaveBeenCalledTimes(1)
      expect(mockSearchDispatch).toHaveBeenNthCalledWith(1, { type: 'INIT' })
      expect(mockIdentityCheckDispatch).toHaveBeenNthCalledWith(1, { type: 'INIT' })
    })
  })

  it('should redirect to NATIVE Cultural Survey WHEN signin is successful and user needs to fill cultural survey', async () => {
    mockMeApiCall({
      needsToFillCulturalSurvey: true,
      showEligibleCard: false,
    } as UserProfileResponse)
    const renderAPI = renderLogin()

    fillInputs(renderAPI)
    fireEvent.press(renderAPI.getByText('Se connecter'))

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledTimes(1)
      expect(navigate).toHaveBeenCalledWith('CulturalSurveyIntro')
    })
  })

  it('should not redirect to EighteenBirthday WHEN signin is successful and user has already seen eligible card and needs to see it', async () => {
    storage.saveObject('has_seen_eligible_card', true)
    mockMeApiCall({
      needsToFillCulturalSurvey: false,
      showEligibleCard: true,
    } as UserProfileResponse)
    const renderAPI = renderLogin()

    fillInputs(renderAPI)
    fireEvent.press(renderAPI.getByText('Se connecter'))

    await waitFor(() => {
      expect(navigateToHome).toHaveBeenCalledTimes(1)
    })
  })

  it('should redirect to EighteenBirthday WHEN signin is successful and user has not seen eligible card and needs to see it', async () => {
    mockMeApiCall({
      needsToFillCulturalSurvey: true,
      showEligibleCard: true,
    } as UserProfileResponse)
    const renderAPI = renderLogin()

    fillInputs(renderAPI)
    fireEvent.press(renderAPI.getByText('Se connecter'))

    await waitFor(() => {
      expect(navigate).toHaveBeenNthCalledWith(1, 'EighteenBirthday')
    })
  })

  it('should redirect to RecreditBirthdayNotification WHEN signin is successful and user has recreditAmountToShow not null', async () => {
    mockMeApiCall({
      needsToFillCulturalSurvey: true,
      showEligibleCard: true,
      recreditAmountToShow: 3000,
    } as UserProfileResponse)
    const renderAPI = renderLogin()

    fillInputs(renderAPI)
    fireEvent.press(renderAPI.getByText('Se connecter'))

    await waitFor(() => {
      expect(navigate).toHaveBeenNthCalledWith(1, 'RecreditBirthdayNotification')
    })
  })

  it('should not redirect to RecreditBirthdayNotification WHEN signin is successful and user has recreditAmountToShow to null', async () => {
    mockMeApiCall({
      needsToFillCulturalSurvey: true,
      showEligibleCard: true,
      recreditAmountToShow: null,
    } as UserProfileResponse)
    const renderAPI = renderLogin()

    fillInputs(renderAPI)
    fireEvent.press(renderAPI.getByText('Se connecter'))

    await waitFor(() => {
      expect(navigate).toHaveBeenNthCalledWith(1, 'EighteenBirthday')
    })
  })

  it('should redirect to SignupConfirmationEmailSent page WHEN signin has failed with EMAIL_NOT_VALIDATED code', async () => {
    simulateSigninEmailNotValidated()
    const renderAPI = renderLogin()

    fillInputs(renderAPI)
    fireEvent.press(renderAPI.getByText('Se connecter'))

    await waitFor(() => {
      expect(navigate).toHaveBeenNthCalledWith(1, 'SignupConfirmationEmailSent', {
        email: 'email@gmail.com',
      })
    })
  })

  it('should redirect to SuspensionScreen WHEN signin is successful for inactive account', async () => {
    simulateSignin200(AccountState.INACTIVE)
    mockSuspensionStatusApiCall(AccountState.SUSPENDED)
    const renderAPI = renderLogin()

    fillInputs(renderAPI)
    fireEvent.press(renderAPI.getByText('Se connecter'))

    await waitFor(() => {
      expect(navigate).toHaveBeenNthCalledWith(1, 'SuspensionScreen')
    })
  })

  it('should show email error message WHEN signin has failed because of invalid e-mail format', async () => {
    const renderAPI = renderLogin()

    const emailInput = renderAPI.getByPlaceholderText('tonadresse@email.com')
    fireEvent.changeText(emailInput, 'not_valid_email@gmail')

    const passwordInput = renderAPI.getByPlaceholderText('Ton mot de passe')
    fireEvent.changeText(passwordInput, 'mypassword')

    fireEvent.press(renderAPI.getByText('Se connecter'))

    await waitFor(() => {
      expect(
        renderAPI.getByText(
          'L’e-mail renseigné est incorrect. Exemple de format attendu : edith.piaf@email.fr'
        )
      ).toBeTruthy()
    })
    expect(navigate).not.toBeCalled()
  })

  it('should show error message and error inputs WHEN signin has failed because of wrong credentials', async () => {
    simulateSigninWrongCredentials()
    const renderAPI = renderLogin()

    fillInputs(renderAPI)
    fireEvent.press(renderAPI.getByText('Se connecter'))

    await waitFor(() => {
      expect(renderAPI.getByText('E-mail ou mot de passe incorrect')).toBeTruthy()
    })
    expect(navigate).not.toBeCalled()
  })

  it('should show error message and error inputs WHEN signin has failed because of network failure', async () => {
    simulateSigninNetworkFailure()
    const renderAPI = renderLogin()

    fillInputs(renderAPI)
    fireEvent.press(renderAPI.getByText('Se connecter'))

    await waitFor(() => {
      expect(
        renderAPI.queryByText('Erreur réseau. Tu peux réessayer une fois la connexion réétablie')
      ).toBeTruthy()
    })
    expect(navigate).not.toBeCalled()
  })

  it('should show specific error message when signin rate limit is exceeded', async () => {
    simulateSigninRateLimitExceeded()
    const renderAPI = renderLogin()

    fillInputs(renderAPI)
    fireEvent.press(renderAPI.getByText('Se connecter'))

    await waitFor(() => {
      expect(
        renderAPI.queryByText('Nombre de tentatives dépassé. Réessaye dans 1 minute')
      ).toBeTruthy()
    })
    expect(navigate).not.toBeCalled()
  })

  it('should enable login button when both text inputs are filled', async () => {
    const renderAPI = renderLogin()

    fillInputs(renderAPI)

    await waitFor(() => {
      const connectedButton = renderAPI.getByText('Se connecter')
      expect(connectedButton).toBeEnabled()
    })
  })

  it('should log analytics when clicking on "Créer un compte" button', async () => {
    const { getByText } = renderLogin()

    const signupButton = getByText('Créer un compte')
    await act(async () => {
      fireEvent.press(signupButton)
    })

    expect(analytics.logSignUp).toHaveBeenNthCalledWith(1, { from: 'Login' })
  })

  describe('Login comes from adding an offer to favorite', () => {
    const OFFER_ID = favoriteResponseSnap.offer.id
    beforeEach(() => {
      useRoute
        .mockReturnValueOnce({ params: { offerId: OFFER_ID, from: From.FAVORITE } }) // first render
        .mockReturnValueOnce({ params: { offerId: OFFER_ID, from: From.FAVORITE } }) // email input rerender
        .mockReturnValueOnce({ params: { offerId: OFFER_ID, from: From.FAVORITE } }) // password input rerender
    })

    it('should redirect to Offer page when signin is successful', async () => {
      const renderAPI = renderLogin()
      fillInputs(renderAPI)
      fireEvent.press(renderAPI.getByText('Se connecter'))

      await waitFor(() => {
        expect(navigate).toHaveBeenNthCalledWith(1, 'Offer', {
          id: OFFER_ID,
        })
      })
    })

    it('should add the previous offer to favorites when signin is successful', async () => {
      simulateAddToFavorites()

      const renderAPI = renderLogin()
      fillInputs(renderAPI)
      fireEvent.press(renderAPI.getByText('Se connecter'))

      await waitFor(() => {
        expect(mockPostFavorite).toHaveBeenCalledTimes(1)
      })
    })

    it('should log analytics when adding the previous offer to favorites', async () => {
      simulateAddToFavorites()
      const renderAPI = renderLogin()
      fillInputs(renderAPI)
      fireEvent.press(renderAPI.getByText('Se connecter'))

      await waitFor(() => {
        expect(analytics.logHasAddedOfferToFavorites).toHaveBeenCalledWith({
          from: 'login',
          offerId: OFFER_ID,
        })
      })
    })

    it('should redirect to CulturalSurveyIntro instead of Offer when user needs to fill it', async () => {
      mockMeApiCall({
        needsToFillCulturalSurvey: true,
        showEligibleCard: false,
      } as UserProfileResponse)
      const renderAPI = renderLogin()
      fillInputs(renderAPI)
      fireEvent.press(renderAPI.getByText('Se connecter'))

      await waitFor(() => {
        expect(navigate).toHaveBeenCalledWith('CulturalSurveyIntro')
      })
    })
  })

  describe('Login from offer booking modal', () => {
    const OFFER_ID = favoriteOfferResponseSnap.id

    beforeEach(() => {
      useRoute
        .mockReturnValueOnce({ params: { offerId: OFFER_ID, from: From.BOOKING } }) // first render
        .mockReturnValueOnce({ params: { offerId: OFFER_ID, from: From.BOOKING } }) // email input rerender
        .mockReturnValueOnce({ params: { offerId: OFFER_ID, from: From.BOOKING } }) // password input rerender
    })

    it('should redirect to the previous offer page and ask to open the booking modal', async () => {
      const renderAPI = renderLogin()
      fillInputs(renderAPI)
      fireEvent.press(renderAPI.getByText('Se connecter'))

      await waitFor(() => {
        expect(navigate).toHaveBeenNthCalledWith(1, 'Offer', {
          id: OFFER_ID,
          openModalOnNavigation: true,
        })
      })
    })
  })
})

const fillInputs = (renderAPI: ReturnType<typeof render>) => {
  const emailInput = renderAPI.getByPlaceholderText('tonadresse@email.com')
  const passwordInput = renderAPI.getByPlaceholderText('Ton mot de passe')
  fireEvent.changeText(emailInput, 'email@gmail.com')
  fireEvent.changeText(passwordInput, 'mypassword')
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
  server.use(
    rest.get<UserProfileResponse>(env.API_BASE_URL + '/native/v1/me', (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(response))
    })
  )
}

function mockSuspensionStatusApiCall(status: string) {
  server.use(
    rest.get<UserProfileResponse>(
      env.API_BASE_URL + '/native/v1/account/suspension_status',
      (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ status }))
      }
    )
  )
}

function simulateSignin200(accountState = AccountState.ACTIVE) {
  server.use(
    rest.post<SigninRequest, SigninResponse>(
      env.API_BASE_URL + '/native/v1/signin',
      async (req, res, ctx) =>
        res(
          ctx.status(200),
          ctx.json({
            accessToken: 'accessToken',
            refreshToken: 'refreshToken',
            accountState,
          })
        )
    )
  )
}

function simulateSigninWrongCredentials() {
  server.use(
    rest.post<SigninRequest, SigninResponse>(
      env.API_BASE_URL + '/native/v1/signin',
      async (req, res, ctx) =>
        res(
          ctx.status(400),
          // @ts-expect-error: signin response type does not account for "not success" responses
          ctx.json({
            general: ['Identifiant ou Mot de passe incorrect'],
          })
        )
    )
  )
}

function simulateSigninRateLimitExceeded() {
  server.use(
    rest.post<SigninRequest, SigninResponse>(
      env.API_BASE_URL + '/native/v1/signin',
      async (req, res, ctx) =>
        res(
          ctx.status(429),
          // @ts-expect-error: signin response type does not account for "not success" responses
          ctx.json({
            general: [
              'Nombre de tentative de connexion dépassé. Veuillez réessayer dans 1 minute.',
            ],
          })
        )
    )
  )
}

function simulateSigninEmailNotValidated() {
  server.use(
    rest.post<SigninRequest, SigninResponse>(
      env.API_BASE_URL + '/native/v1/signin',
      async (req, res, ctx) =>
        res(
          ctx.status(400),
          // @ts-expect-error: signin response type does not account for "not success" responses
          ctx.json({
            code: 'EMAIL_NOT_VALIDATED',
            general: ['L’email n’a pas été validé.'],
          })
        )
    )
  )
}

function simulateSigninNetworkFailure() {
  server.use(
    rest.post<SigninRequest, SigninResponse>(
      env.API_BASE_URL + '/native/v1/signin',
      async (req, res) => res.networkError('Network request failed')
    )
  )
}

function simulateAddToFavorites() {
  server.use(
    rest.post<EmptyResponse>(
      `${env.API_BASE_URL}/native/v1/me/favorites`,
      (_req, response, ctx) => {
        mockPostFavorite()
        return response.once(ctx.status(200), ctx.json(favoriteResponseSnap))
      }
    )
  )
}
