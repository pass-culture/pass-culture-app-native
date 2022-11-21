import { rest } from 'msw'
import React from 'react'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import { FAKE_USER_ID } from '__mocks__/jwt-decode'
import { BatchUser } from '__mocks__/libs/react-native-batch'
import { AccountState, SigninRequest, SigninResponse, UserProfileResponse } from 'api/gen'
import { usePreviousRoute, navigateToHome } from 'features/navigation/helpers'
import { env } from 'libs/environment'
import { analytics } from 'libs/firebase/analytics'
import { storage } from 'libs/storage'
import { server } from 'tests/server'
import { flushAllPromisesWithAct, superFlushWithAct, fireEvent, render } from 'tests/utils'

import { AuthContext } from '../AuthContext'

import { Login } from './Login'

jest.mock('react-query')
jest.mock('features/navigation/helpers')
const mockSearchDispatch = jest.fn()
const mockIdentityCheckDispatch = jest.fn()
jest.mock('features/search/context/SearchWrapper/SearchWrapper', () => ({
  useSearch: jest.fn(() => ({ dispatch: mockSearchDispatch })),
}))
jest.mock('features/identityCheck/context/SubscriptionContextProvider', () => ({
  useSubscriptionContext: jest.fn(() => ({ dispatch: mockIdentityCheckDispatch })),
}))

const mockUsePreviousRoute = usePreviousRoute as jest.Mock

const mockSettings = {
  enableNativeCulturalSurvey: false,
}

jest.mock('features/auth/settings', () => ({
  useAppSettings: jest.fn(() => ({
    data: mockSettings,
  })),
}))

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
    const emailInput = renderAPI.getByPlaceholderText('tonadresse@email.com')
    const passwordInput = renderAPI.getByPlaceholderText('Ton mot de passe')
    fireEvent.changeText(emailInput, 'email@gmail.com')
    fireEvent.changeText(passwordInput, 'mypassword')

    fireEvent.press(renderAPI.getByText('Se connecter'))
    await flushAllPromisesWithAct()

    await waitForExpect(() => {
      expect(BatchUser.editor().setIdentifier).toHaveBeenCalledWith(FAKE_USER_ID.toString())
      expect(analytics.setUserId).toHaveBeenCalledWith(FAKE_USER_ID)
      expect(navigateToHome).toBeCalledTimes(1)
      expect(mockSearchDispatch).toHaveBeenNthCalledWith(1, { type: 'INIT' })
      expect(mockIdentityCheckDispatch).toHaveBeenNthCalledWith(1, { type: 'INIT' })
    })
  })

  it('should redirect to Cultural Survey WHEN signin is successful and user needs to fill cultural survey', async () => {
    mockMeApiCall({
      needsToFillCulturalSurvey: true,
      showEligibleCard: false,
    } as UserProfileResponse)
    const renderAPI = renderLogin()
    const emailInput = renderAPI.getByPlaceholderText('tonadresse@email.com')
    const passwordInput = renderAPI.getByPlaceholderText('Ton mot de passe')
    fireEvent.changeText(emailInput, 'email@gmail.com')
    fireEvent.changeText(passwordInput, 'mypassword')

    fireEvent.press(renderAPI.getByText('Se connecter'))
    await flushAllPromisesWithAct()

    await waitForExpect(() => {
      expect(navigate).toBeCalledTimes(1)
      expect(navigate).toBeCalledWith('CulturalSurvey')
    })
  })

  it('should redirect to NATIVE Cultural Survey WHEN signin is successful, user needs to fill cultural survey when feature flag is activated', async () => {
    mockSettings.enableNativeCulturalSurvey = true
    mockMeApiCall({
      needsToFillCulturalSurvey: true,
      showEligibleCard: false,
    } as UserProfileResponse)
    const renderAPI = renderLogin()
    const emailInput = renderAPI.getByPlaceholderText('tonadresse@email.com')
    const passwordInput = renderAPI.getByPlaceholderText('Ton mot de passe')
    fireEvent.changeText(emailInput, 'email@gmail.com')
    fireEvent.changeText(passwordInput, 'mypassword')

    fireEvent.press(renderAPI.getByText('Se connecter'))
    await flushAllPromisesWithAct()

    await waitForExpect(() => {
      expect(navigate).toBeCalledTimes(1)
      expect(navigate).toBeCalledWith('CulturalSurveyIntro')
    })
  })

  it('should not redirect to EighteenBirthday WHEN signin is successful and user has already seen eligible card and needs to see it', async () => {
    storage.saveObject('has_seen_eligible_card', true)
    mockMeApiCall({
      needsToFillCulturalSurvey: false,
      showEligibleCard: true,
    } as UserProfileResponse)
    const renderAPI = renderLogin()
    const emailInput = renderAPI.getByPlaceholderText('tonadresse@email.com')
    const passwordInput = renderAPI.getByPlaceholderText('Ton mot de passe')
    fireEvent.changeText(emailInput, 'email@gmail.com')
    fireEvent.changeText(passwordInput, 'mypassword')

    fireEvent.press(renderAPI.getByText('Se connecter'))
    await flushAllPromisesWithAct()

    await waitForExpect(() => {
      expect(navigateToHome).toBeCalledTimes(1)
    })
  })

  it('should redirect to EighteenBirthday WHEN signin is successful and user has not seen eligible card and needs to see it', async () => {
    mockMeApiCall({
      needsToFillCulturalSurvey: true,
      showEligibleCard: true,
    } as UserProfileResponse)
    const renderAPI = renderLogin()
    const emailInput = renderAPI.getByPlaceholderText('tonadresse@email.com')
    const passwordInput = renderAPI.getByPlaceholderText('Ton mot de passe')
    fireEvent.changeText(emailInput, 'email@gmail.com')
    fireEvent.changeText(passwordInput, 'mypassword')

    fireEvent.press(renderAPI.getByText('Se connecter'))
    await flushAllPromisesWithAct()

    await waitForExpect(() => {
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
    const emailInput = renderAPI.getByPlaceholderText('tonadresse@email.com')
    const passwordInput = renderAPI.getByPlaceholderText('Ton mot de passe')
    fireEvent.changeText(emailInput, 'email@gmail.com')
    fireEvent.changeText(passwordInput, 'mypassword')

    fireEvent.press(renderAPI.getByText('Se connecter'))
    await flushAllPromisesWithAct()

    await waitForExpect(() => {
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
    const emailInput = renderAPI.getByPlaceholderText('tonadresse@email.com')
    const passwordInput = renderAPI.getByPlaceholderText('Ton mot de passe')
    fireEvent.changeText(emailInput, 'email@gmail.com')
    fireEvent.changeText(passwordInput, 'mypassword')

    fireEvent.press(renderAPI.getByText('Se connecter'))
    await flushAllPromisesWithAct()

    await waitForExpect(() => {
      expect(navigate).toHaveBeenNthCalledWith(1, 'EighteenBirthday')
    })
  })

  it('should redirect to SignupConfirmationEmailSent page WHEN signin has failed with EMAIL_NOT_VALIDATED code', async () => {
    simulateSigninEmailNotValidated()
    const renderAPI = renderLogin()
    const emailInput = renderAPI.getByPlaceholderText('tonadresse@email.com')
    const passwordInput = renderAPI.getByPlaceholderText('Ton mot de passe')
    fireEvent.changeText(emailInput, 'email@gmail.com')
    fireEvent.changeText(passwordInput, 'mypassword')

    fireEvent.press(renderAPI.getByText('Se connecter'))
    await flushAllPromisesWithAct()

    await waitForExpect(() => {
      expect(navigate).toHaveBeenNthCalledWith(1, 'SignupConfirmationEmailSent', {
        email: 'email@gmail.com',
      })
    })
  })

  it('should redirect to SuspensionScreen WHEN signin is successful for inactive account', async () => {
    simulateSignin200(AccountState.INACTIVE)
    mockSuspensionStatusApiCall(AccountState.SUSPENDED)
    const renderAPI = renderLogin()
    const emailInput = renderAPI.getByPlaceholderText('tonadresse@email.com')
    const passwordInput = renderAPI.getByPlaceholderText('Ton mot de passe')
    fireEvent.changeText(emailInput, 'email@gmail.com')
    fireEvent.changeText(passwordInput, 'mypassword')

    fireEvent.press(renderAPI.getByText('Se connecter'))
    await superFlushWithAct()

    await waitForExpect(() => {
      expect(navigate).toHaveBeenNthCalledWith(1, 'SuspensionScreen')
    })
  })

  it('should show email error message WHEN signin has failed because of invalid e-mail format', async () => {
    const renderAPI = renderLogin()
    const notErrorSnapshot = renderAPI.toJSON()
    const emailInput = renderAPI.getByPlaceholderText('tonadresse@email.com')
    const passwordInput = renderAPI.getByPlaceholderText('Ton mot de passe')
    fireEvent.changeText(emailInput, 'not_valid_email@gmail')
    fireEvent.changeText(passwordInput, 'mypassword')

    fireEvent.press(renderAPI.getByText('Se connecter'))
    await superFlushWithAct()

    await waitForExpect(() => {
      expect(
        renderAPI.getByText(
          'L’e-mail renseigné est incorrect. Exemple de format attendu : edith.piaf@email.fr'
        )
      ).toBeTruthy()
      const errorSnapshot = renderAPI.toJSON()
      expect(notErrorSnapshot).toMatchDiffSnapshot(errorSnapshot)
    })
    expect(navigate).not.toBeCalled()
  })

  it('should show error message and error inputs WHEN signin has failed because of wrong credentials', async () => {
    simulateSigninWrongCredentials()
    const renderAPI = renderLogin()
    const notErrorSnapshot = renderAPI.toJSON()
    const emailInput = renderAPI.getByPlaceholderText('tonadresse@email.com')
    const passwordInput = renderAPI.getByPlaceholderText('Ton mot de passe')
    fireEvent.changeText(emailInput, 'email@gmail.com')
    fireEvent.changeText(passwordInput, 'mypassword')

    fireEvent.press(renderAPI.getByText('Se connecter'))
    await superFlushWithAct()

    await waitForExpect(() => {
      expect(renderAPI.getByText('E-mail ou mot de passe incorrect')).toBeTruthy()
      const errorSnapshot = renderAPI.toJSON()
      expect(notErrorSnapshot).toMatchDiffSnapshot(errorSnapshot)
    })
    expect(navigate).not.toBeCalled()
  })

  it('should show error message and error inputs WHEN signin has failed because of network failure', async () => {
    simulateSigninNetworkFailure()
    const renderAPI = renderLogin()
    const notErrorSnapshot = renderAPI.toJSON()
    const emailInput = renderAPI.getByPlaceholderText('tonadresse@email.com')
    const passwordInput = renderAPI.getByPlaceholderText('Ton mot de passe')
    fireEvent.changeText(emailInput, 'email@gmail.com')
    fireEvent.changeText(passwordInput, 'mypassword')

    fireEvent.press(renderAPI.getByText('Se connecter'))
    await flushAllPromisesWithAct()

    await waitForExpect(() => {
      expect(
        renderAPI.queryByText('Erreur réseau. Tu peux réessayer une fois la connexion réétablie')
      ).toBeTruthy()
    })
    const errorSnapshot = renderAPI.toJSON()
    expect(notErrorSnapshot).toMatchDiffSnapshot(errorSnapshot)
    expect(navigate).not.toBeCalled()
  })

  it('should show specific error message when signin rate limit is exceeded', async () => {
    simulateSigninRateLimitExceeded()
    const renderAPI = renderLogin()
    const rateExceededSnapshot = renderAPI.toJSON()
    const emailInput = renderAPI.getByPlaceholderText('tonadresse@email.com')
    const passwordInput = renderAPI.getByPlaceholderText('Ton mot de passe')
    fireEvent.changeText(emailInput, 'email@gmail.com')
    fireEvent.changeText(passwordInput, 'mypassword')

    fireEvent.press(renderAPI.getByText('Se connecter'))
    await flushAllPromisesWithAct()
    await superFlushWithAct()

    await waitForExpect(() => {
      expect(
        renderAPI.queryByText('Nombre de tentatives dépassé. Réessaye dans 1 minute')
      ).toBeTruthy()
    })
    const errorSnapshot = renderAPI.toJSON()
    expect(rateExceededSnapshot).toMatchDiffSnapshot(errorSnapshot)
    expect(navigate).not.toBeCalled()
  })

  it('should enable login button when both text inputs are filled', async () => {
    const renderAPI = renderLogin()
    const disabledButtonSnapshot = renderAPI.toJSON()

    const emailInput = renderAPI.getByPlaceholderText('tonadresse@email.com')
    const passwordInput = renderAPI.getByPlaceholderText('Ton mot de passe')
    fireEvent.changeText(emailInput, 'email@gmail.com')
    fireEvent.changeText(passwordInput, 'mypassword')

    await flushAllPromisesWithAct()

    const enabledButtonSnapshot = renderAPI.toJSON()
    expect(disabledButtonSnapshot).toMatchDiffSnapshot(enabledButtonSnapshot)
  })
})

function renderLogin() {
  return render(
    <AuthContext.Provider value={{ isLoggedIn: true, setIsLoggedIn: jest.fn() }}>
      <Login />
    </AuthContext.Provider>
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
            general: ["L'email n'a pas été validé."],
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
