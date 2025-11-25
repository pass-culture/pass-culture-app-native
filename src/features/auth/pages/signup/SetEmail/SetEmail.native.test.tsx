import React from 'react'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { OauthStateResponse } from 'api/gen'
import { PreValidationSignupNormalStepProps, SignInResponseFailure } from 'features/auth/types'
import { StepperOrigin } from 'features/navigation/navigators/RootNavigator/types'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen, userEvent } from 'tests/utils'
import { SUGGESTION_DELAY_IN_MS } from 'ui/components/inputs/EmailInputWithSpellingHelp/useEmailSpellingHelp'
import { SNACK_BAR_TIME_OUT_LONG } from 'ui/components/snackBar/SnackBarContext'

import { SetEmail } from './SetEmail'

jest.mock('libs/network/NetInfoWrapper')

jest.mock('features/identityCheck/context/SubscriptionContextProvider', () => ({
  useSubscriptionContext: jest.fn(() => ({ dispatch: jest.fn() })),
}))

const defaultProps = {
  previousSignupData: {
    email: '',
    marketingEmailSubscription: false,
    password: '',
    birthdate: '',
  },
  isSSOSubscription: false,
  goToNextStep: jest.fn(),
  signUp: jest.fn(),
  onSSOEmailNotFoundError: jest.fn(),
  onDefaultEmailSignup: jest.fn(),
}

jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    resetSearch: jest.fn(),
  }),
}))

jest.useFakeTimers()

const INCORRECT_EMAIL_MESSAGE =
  'L’e-mail renseigné est incorrect. Exemple de format attendu\u00a0: edith.piaf@email.fr'

const mockShowErrorSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showErrorSnackBar: mockShowErrorSnackBar,
  }),
}))

jest.mock('libs/firebase/analytics/analytics')

const user = userEvent.setup()

describe('<SetEmail />', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  it('should disable validate button when email input is not filled', () => {
    renderSetEmail()

    const button = screen.getByText('Continuer')

    expect(button).toBeDisabled()
  })

  it('should display disabled validate button when email input is filled with spaces', async () => {
    renderSetEmail()

    await act(async () => {
      const emailInput = screen.getByTestId('Entrée pour l’email')
      fireEvent.changeText(emailInput, '    ')
    })

    const button = screen.getByText('Continuer')

    expect(button).toBeDisabled()
  })

  it('should enable validate button when email input is filled', async () => {
    renderSetEmail()

    await act(async () => {
      const emailInput = screen.getByTestId('Entrée pour l’email')
      fireEvent.changeText(emailInput, 'john.doe@gmail.com')
    })

    const button = screen.getByText('Continuer')

    expect(button).toBeEnabled()
  })

  it('should go to next step on valid email with email and newsletter params', async () => {
    renderSetEmail()

    await act(async () => {
      const emailInput = screen.getByTestId('Entrée pour l’email')
      fireEvent.changeText(emailInput, 'john.doe@gmail.com')
    })

    await user.press(screen.getByText('Continuer'))

    expect(defaultProps.goToNextStep).toHaveBeenCalledWith({
      email: 'john.doe@gmail.com',
      marketingEmailSubscription: false,
      accountCreationToken: undefined,
    })
  })

  it('should hide email help message when email is valid', async () => {
    renderSetEmail()

    await act(async () => {
      const emailInput = screen.getByTestId('Entrée pour l’email')
      fireEvent.changeText(emailInput, 'john.doe@gmail.com')
    })
    await user.press(screen.getByText('Continuer'))

    expect(screen.queryByText(INCORRECT_EMAIL_MESSAGE, { hidden: true })).not.toBeOnTheScreen()
  })

  it('should reject invalid email when trying to submit', async () => {
    renderSetEmail()

    await act(async () => {
      const emailInput = screen.getByTestId('Entrée pour l’email')
      fireEvent.changeText(emailInput, 'john.doe')
    })

    await user.press(screen.getByText('Continuer'))

    expect(screen.getByText(INCORRECT_EMAIL_MESSAGE, { hidden: true })).toBeOnTheScreen()
  })

  it('should log analytics when clicking on "Se connecter" button', async () => {
    renderSetEmail()

    await user.press(screen.getByText('Se connecter'))

    expect(analytics.logLoginClicked).toHaveBeenNthCalledWith(1, { from: 'SetEmail' })
  })

  it('should display suggestion with a corrected email when the email is mistyped', async () => {
    renderSetEmail()

    await act(async () => {
      const emailInput = screen.getByTestId('Entrée pour l’email')
      fireEvent.changeText(emailInput, 'john.doe@gmal.com')
    })

    await act(async () => {
      jest.advanceTimersByTime(SUGGESTION_DELAY_IN_MS)
    })

    expect(screen.getByText('Veux-tu plutôt dire john.doe@gmail.com\u00a0?')).toBeOnTheScreen()
  })

  it('should log analytics when user select the suggested email', async () => {
    renderSetEmail()

    await act(async () => {
      const emailInput = screen.getByTestId('Entrée pour l’email')
      fireEvent.changeText(emailInput, 'john.doe@gmal.com')
    })

    await act(async () => {
      jest.advanceTimersByTime(SUGGESTION_DELAY_IN_MS)
    })

    await user.press(screen.getByText('Appliquer la modification'))

    expect(analytics.logHasCorrectedEmail).toHaveBeenNthCalledWith(1, { from: 'setemail' })
  })

  it('should navigate to Login with provided offerId when clicking on "Se connecter" button', async () => {
    const OFFER_ID = 1
    useRoute.mockReturnValueOnce({ params: { offerId: OFFER_ID } })
    renderSetEmail()

    await user.press(screen.getByText('Se connecter'))

    expect(navigate).toHaveBeenNthCalledWith(1, 'Login', {
      from: StepperOrigin.SIGNUP,
      offerId: OFFER_ID,
    })
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

  it('should set default marketing email subscription choice to true if the user has already chosen', async () => {
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

  it('should set default marketing email subscription choice to false', async () => {
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
    it('should display SSO button when FF is enabled', async () => {
      setFeatureFlags([RemoteStoreFeatureFlags.WIP_ENABLE_GOOGLE_SSO])

      renderSetEmail()

      expect(await screen.findByTestId('S’inscrire avec Google')).toBeOnTheScreen()
    })

    it('should not display SSO button when FF is disabled', () => {
      setFeatureFlags()

      renderSetEmail()

      expect(screen.queryByTestId('S’inscrire avec Google')).not.toBeOnTheScreen()
    })

    it('should go to next step when clicking SSO button and account does not already exist', async () => {
      setFeatureFlags([RemoteStoreFeatureFlags.WIP_ENABLE_GOOGLE_SSO])

      mockServer.postApi<SignInResponseFailure['content']>('/v1/oauth/google/authorize', {
        responseOptions: {
          statusCode: 401,
          data: {
            code: 'SSO_EMAIL_NOT_FOUND',
            accountCreationToken: 'accountCreationToken',
            email: 'user@gmail.com',
            general: [],
          },
        },
      })

      renderSetEmail()

      await screen.findByText('Crée-toi un compte')

      await user.press(screen.getByText('S’inscrire avec Google'))

      expect(defaultProps.onSSOEmailNotFoundError).toHaveBeenCalledTimes(1)
      expect(defaultProps.goToNextStep).toHaveBeenCalledWith({
        accountCreationToken: 'accountCreationToken',
      })
    })

    it('should display snackbar when SSO account is invalid', async () => {
      setFeatureFlags([RemoteStoreFeatureFlags.WIP_ENABLE_GOOGLE_SSO])

      mockServer.postApi<SignInResponseFailure['content']>('/v1/oauth/google/authorize', {
        responseOptions: {
          statusCode: 400,
          data: {
            code: 'SSO_ACCOUNT_DELETED',
            general: [],
          },
        },
      })

      renderSetEmail()

      await screen.findByText('Crée-toi un compte')

      await user.press(screen.getByText('S’inscrire avec Google'))

      expect(mockShowErrorSnackBar).toHaveBeenCalledWith({
        message:
          'Ton compte Google semble ne pas être valide. Pour pouvoir t’inscrire, confirme d’abord ton adresse e-mail Google.',
        timeout: SNACK_BAR_TIME_OUT_LONG,
      })
    })
  })
})

const renderSetEmail = (props: PreValidationSignupNormalStepProps = defaultProps) => {
  mockServer.getApi<OauthStateResponse>('/v1/oauth/state', {
    oauthStateToken: 'oauth_state_token',
  })

  render(reactQueryProviderHOC(<SetEmail {...props} />))
}
