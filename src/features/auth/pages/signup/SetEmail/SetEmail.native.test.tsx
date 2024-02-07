import React from 'react'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { OauthStateResponse } from 'api/gen'
import { PreValidationSignupNormalStepProps, SignInResponseFailure } from 'features/auth/types'
import * as OpenUrlAPI from 'features/navigation/helpers/openUrl'
import { analytics } from 'libs/analytics'
import { env } from 'libs/environment/__mocks__/envFixtures'
// eslint-disable-next-line no-restricted-imports
import { firebaseAnalytics } from 'libs/firebase/analytics'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen } from 'tests/utils'
import { SUGGESTION_DELAY_IN_MS } from 'ui/components/inputs/EmailInputWithSpellingHelp/useEmailSpellingHelp'
import { SNACK_BAR_TIME_OUT_LONG } from 'ui/components/snackBar/SnackBarContext'

import { SetEmail } from './SetEmail'

jest.mock('features/identityCheck/context/SubscriptionContextProvider', () => ({
  useSubscriptionContext: jest.fn(() => ({ dispatch: jest.fn() })),
}))
const openUrl = jest.spyOn(OpenUrlAPI, 'openUrl')
const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)

const defaultProps = {
  goToNextStep: jest.fn(),
  signUp: jest.fn(),
  previousSignupData: {
    email: '',
    marketingEmailSubscription: false,
    password: '',
    birthdate: '',
  },
  onSSOEmailNotFoundError: jest.fn(),
  onDefaultEmailSignup: jest.fn(),
}

jest.useFakeTimers({ legacyFakeTimers: true })

const INCORRECT_EMAIL_MESSAGE =
  'L’e-mail renseigné est incorrect. Exemple de format attendu\u00a0: edith.piaf@email.fr'

const mockShowErrorSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showErrorSnackBar: mockShowErrorSnackBar,
  }),
}))

describe('<SetEmail />', () => {
  it('should disable validate button when email input is not filled', async () => {
    renderSetEmail()

    await act(async () => {})
    const button = screen.getByText('Continuer')

    expect(button).toBeDisabled()
  })

  it('should display disabled validate button when email input is filled with spaces', async () => {
    renderSetEmail()

    await act(async () => {
      const emailInput = screen.getByPlaceholderText('tonadresse@email.com')
      fireEvent.changeText(emailInput, '    ')
    })

    const button = screen.getByText('Continuer')

    expect(button).toBeDisabled()
  })

  it('should enable validate button when email input is filled', async () => {
    renderSetEmail()

    await act(async () => {
      const emailInput = screen.getByPlaceholderText('tonadresse@email.com')
      fireEvent.changeText(emailInput, 'john.doe@gmail.com')
    })

    const button = screen.getByText('Continuer')

    expect(button).toBeEnabled()
  })

  it('should go to next step on valid email with email and newsletter params', async () => {
    renderSetEmail()

    await act(async () => {
      const emailInput = screen.getByPlaceholderText('tonadresse@email.com')
      fireEvent.changeText(emailInput, 'john.doe@gmail.com')
    })

    await act(async () => {
      const continueButton = screen.getByText('Continuer')
      fireEvent.press(continueButton)
    })

    expect(defaultProps.goToNextStep).toHaveBeenCalledWith({
      email: 'john.doe@gmail.com',
      marketingEmailSubscription: false,
      accountCreationToken: undefined,
    })
  })

  it('should hide email help message when email is valid', async () => {
    renderSetEmail()

    await act(async () => {
      const emailInput = screen.getByPlaceholderText('tonadresse@email.com')
      fireEvent.changeText(emailInput, 'john.doe@gmail.com')
    })
    await act(async () => {
      const continueButton = screen.getByText('Continuer')
      fireEvent.press(continueButton)
    })

    expect(screen.queryByText(INCORRECT_EMAIL_MESSAGE)).not.toBeOnTheScreen()
  })

  it('should reject invalid email when trying to submit', async () => {
    renderSetEmail()

    await act(async () => {
      const emailInput = screen.getByPlaceholderText('tonadresse@email.com')
      fireEvent.changeText(emailInput, 'john.doe')
    })

    await act(async () => {
      const continueButton = screen.getByText('Continuer')
      fireEvent.press(continueButton)
    })

    expect(screen.queryByText(INCORRECT_EMAIL_MESSAGE)).toBeOnTheScreen()
  })

  it('should log analytics when clicking on "Se connecter" button', async () => {
    renderSetEmail()

    await act(async () => {
      const loginButton = screen.getByText('Se connecter')
      fireEvent.press(loginButton)
    })

    expect(firebaseAnalytics.logLogin).toHaveBeenNthCalledWith(1, { method: 'fromSetEmail' })
  })

  it('should display suggestion with a corrected email when the email is mistyped', async () => {
    renderSetEmail()

    await act(async () => {
      const emailInput = screen.getByPlaceholderText('tonadresse@email.com')
      fireEvent.changeText(emailInput, 'john.doe@gmal.com')
    })

    await act(async () => {
      jest.advanceTimersByTime(SUGGESTION_DELAY_IN_MS)
    })

    expect(screen.queryByText('Veux-tu plutôt dire john.doe@gmail.com\u00a0?')).toBeOnTheScreen()
  })

  it('should log analytics when user select the suggested email', async () => {
    renderSetEmail()

    await act(async () => {
      const emailInput = screen.getByPlaceholderText('tonadresse@email.com')
      fireEvent.changeText(emailInput, 'john.doe@gmal.com')
    })

    await act(async () => {
      jest.advanceTimersByTime(SUGGESTION_DELAY_IN_MS)
    })

    const suggestionButton = screen.getByText('Appliquer la modification')
    fireEvent.press(suggestionButton)

    expect(analytics.logHasCorrectedEmail).toHaveBeenNthCalledWith(1, { from: 'setemail' })
  })

  it('should navigate to Login with provided offerId when clicking on "Se connecter" button', async () => {
    const OFFER_ID = 1
    useRoute.mockReturnValueOnce({ params: { offerId: OFFER_ID } })
    renderSetEmail()

    await act(async () => {
      const loginButton = screen.getByText('Se connecter')
      fireEvent.press(loginButton)
    })

    expect(navigate).toHaveBeenNthCalledWith(1, 'Login', {
      offerId: OFFER_ID,
    })
  })

  it('should open FAQ link when clicking on "Comment gérer tes données personnelles ?" button', async () => {
    renderSetEmail()

    await act(async () => {})

    const faqLink = screen.getByText('Comment gérer tes données personnelles ?')
    fireEvent.press(faqLink)

    expect(openUrl).toHaveBeenNthCalledWith(1, env.FAQ_LINK_PERSONAL_DATA, undefined, true)
  })

  it('should log screen view when the screen is mounted', async () => {
    renderSetEmail()

    await act(async () => {})

    expect(analytics.logScreenViewSetEmail).toHaveBeenCalledTimes(1)
  })

  it('should set a default email if the user has already added his email', async () => {
    const propsWithPreviousEmail = {
      ...defaultProps,
      previousSignupData: {
        ...defaultProps.previousSignupData,
        email: 'john.doe@gmail.com',
      },
    }
    renderSetEmail(propsWithPreviousEmail)

    const emailInput = await screen.findByTestId('Entrée pour l’email')

    expect(emailInput.props.value).toBe('john.doe@gmail.com')
  })

  it('should set a default marketing email subscription choice to true if the user has already chosen', async () => {
    const propsWithPreviousEmail = {
      ...defaultProps,
      previousSignupData: {
        ...defaultProps.previousSignupData,
        marketingEmailSubscription: true,
      },
    }
    renderSetEmail(propsWithPreviousEmail)

    const marketingEmailSubscriptionCheckbox = await screen.findByRole('checkbox')

    expect(marketingEmailSubscriptionCheckbox.props.accessibilityState.checked).toBe(true)
  })

  it('should set a default marketing email subscription choice to false', async () => {
    const propsWithoutMarketingEmailSubscription = {
      ...defaultProps,
      previousSignupData: {
        ...defaultProps.previousSignupData,
        marketingEmailSubscription: undefined,
      },
    }
    renderSetEmail(propsWithoutMarketingEmailSubscription)

    const marketingEmailSubscriptionCheckbox = await screen.findByRole('checkbox')

    expect(marketingEmailSubscriptionCheckbox.props.accessibilityState.checked).toBe(false)
  })

  describe('SSO', () => {
    afterEach(() => {
      useFeatureFlagSpy.mockReturnValue(false)
    })

    it('should not display SSO button when FF is disabled', async () => {
      renderSetEmail()

      await act(async () => {})

      expect(screen.queryByTestId('S’inscrire avec Google')).not.toBeOnTheScreen()
    })

    it('should display SSO button when FF is enabled', async () => {
      useFeatureFlagSpy.mockReturnValueOnce(true)

      renderSetEmail()

      expect(await screen.findByTestId('S’inscrire avec Google')).toBeOnTheScreen()
    })

    it('should go to next step when clicking SSO button and account does not already exist', async () => {
      mockServer.getApiV1<OauthStateResponse>('/oauth/state', {
        oauthStateToken: 'oauth_state_token',
      })
      mockServer.postApiV1<SignInResponseFailure['content']>('/oauth/google/authorize', {
        responseOptions: {
          statusCode: 401,
          data: {
            code: 'SSO_EMAIL_NOT_FOUND',
            general: [],
            accountCreationToken: 'accountCreationToken',
          },
        },
      })
      useFeatureFlagSpy.mockReturnValueOnce(true) // first call in SetEmail
      useFeatureFlagSpy.mockReturnValueOnce(true) // second call in useOAuthState

      renderSetEmail()

      await act(() => {})

      const signupButton = screen.getByText('S’inscrire avec Google')

      await act(async () => fireEvent.press(signupButton))

      expect(defaultProps.onSSOEmailNotFoundError).toHaveBeenCalledTimes(1)
      expect(defaultProps.goToNextStep).toHaveBeenCalledWith({
        accountCreationToken: 'accountCreationToken',
      })
    })

    it('should display snackbar when SSO account is invalid', async () => {
      mockServer.getApiV1<OauthStateResponse>('/oauth/state', {
        oauthStateToken: 'oauth_state_token',
      })
      mockServer.postApiV1<SignInResponseFailure['content']>('/oauth/google/authorize', {
        responseOptions: {
          statusCode: 400,
          data: {
            code: 'SSO_ACCOUNT_DELETED',
            general: [],
          },
        },
      })
      useFeatureFlagSpy.mockReturnValueOnce(true) // first call in SetEmail
      useFeatureFlagSpy.mockReturnValueOnce(true) // second call in useOAuthState

      renderSetEmail()

      await act(() => {})

      const signupButton = screen.getByText('S’inscrire avec Google')

      await act(async () => fireEvent.press(signupButton))

      expect(mockShowErrorSnackBar).toHaveBeenCalledWith({
        message:
          'Ton compte Google semble ne pas être valide. Pour pouvoir t’inscrire, confirme d’abord ton adresse e-mail Google.',
        timeout: SNACK_BAR_TIME_OUT_LONG,
      })
    })
  })
})

const renderSetEmail = (props: PreValidationSignupNormalStepProps = defaultProps) => {
  render(reactQueryProviderHOC(<SetEmail {...props} />))
}
