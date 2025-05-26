import React from 'react'

import { replace } from '__mocks__/@react-navigation/native'
import * as API from 'api/api'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import * as useGoBack from 'features/navigation/useGoBack'
import { OnboardingSubscription } from 'features/subscription/page/OnboardingSubscription'
import { SubscriptionTheme } from 'features/subscription/types'
import { beneficiaryUser } from 'fixtures/user'
import { analytics } from 'libs/analytics/provider'
import { storage } from 'libs/storage'
import { mockAuthContextWithUser } from 'tests/AuthContextUtils'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent, waitFor } from 'tests/utils'
import { SNACK_BAR_TIME_OUT } from 'ui/components/snackBar/SnackBarContext'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

jest.mock('libs/jwt/jwt')
jest.mock('features/auth/context/AuthContext')

const patchProfileSpy = jest.spyOn(API.api, 'patchNativeV1Profile')

const mockGoBack = jest.fn()
jest.spyOn(useGoBack, 'useGoBack').mockReturnValue({
  goBack: mockGoBack,
  canGoBack: jest.fn(() => true),
})

const mockShowSuccessSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showSuccessSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowSuccessSnackBar(props)),
  }),
}))

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()
jest.useFakeTimers()

describe('OnboardingSubscription', () => {
  beforeEach(() => {
    mockAuthContextWithUser(beneficiaryUser, { persist: true })
    storage.clear('has_seen_onboarding_subscription')
  })

  it('should render correctly', async () => {
    render(reactQueryProviderHOC(<OnboardingSubscription />))

    await screen.findByText('Choisis des thèmes à suivre')

    expect(screen).toMatchSnapshot()
  })

  it('should write to local storage that user has seen page', async () => {
    render(reactQueryProviderHOC(<OnboardingSubscription />))

    await waitFor(async () => {
      expect(await storage.readObject('has_seen_onboarding_subscription')).toEqual(true)
    })
  })

  it('should go back when user presses "Non merci"', async () => {
    render(reactQueryProviderHOC(<OnboardingSubscription />))

    await user.press(await screen.findByLabelText('Ne pas suivre de thème'))

    expect(mockGoBack).toHaveBeenCalledTimes(1)
  })

  it('should check theme when user presses a category button', async () => {
    render(reactQueryProviderHOC(<OnboardingSubscription />))

    await user.press(await screen.findByLabelText('Activités créatives'))

    expect(screen.getByLabelText('Activités créatives')).toHaveAccessibilityState({
      checked: true,
    })
  })

  it('should precheck themes when user has already subscribed to some', async () => {
    mockAuthContextWithUser({
      ...beneficiaryUser,
      subscriptions: {
        marketingEmail: true,
        marketingPush: true,
        subscribedThemes: [SubscriptionTheme.MUSIQUE],
      },
    })
    render(reactQueryProviderHOC(<OnboardingSubscription />))

    expect(await screen.findByLabelText('Musique')).toHaveAccessibilityState({ checked: true })
  })

  it('should disable validate button when no theme is selected', async () => {
    render(reactQueryProviderHOC(<OnboardingSubscription />))

    expect(await screen.findByLabelText('Suivre la sélection')).toBeDisabled()
  })

  it('should subscribed to selected themes when user presses "Suivre la sélection"', async () => {
    mockServer.patchApi('/v1/profile', {})

    render(reactQueryProviderHOC(<OnboardingSubscription />))

    await user.press(screen.getByLabelText('Activités créatives'))

    await user.press(screen.getByText('Suivre la sélection'))

    expect(patchProfileSpy).toHaveBeenCalledWith({
      subscriptions: {
        marketingEmail: true,
        marketingPush: true,
        subscribedThemes: [SubscriptionTheme.ACTIVITES],
      },
      origin: 'OnboardingSubscription',
    })
  })

  it('should navigate to home on subscription success', async () => {
    mockServer.patchApi('/v1/profile', {})

    render(reactQueryProviderHOC(<OnboardingSubscription />))

    await user.press(screen.getByLabelText('Activités créatives'))
    await user.press(screen.getByText('Suivre la sélection'))

    expect(replace).toHaveBeenCalledWith(...homeNavConfig)
  })

  it('should show success snackbar on subscription success', async () => {
    mockServer.patchApi('/v1/profile', {})

    render(reactQueryProviderHOC(<OnboardingSubscription />))

    await user.press(screen.getByLabelText('Activités créatives'))
    await user.press(screen.getByText('Suivre la sélection'))

    expect(mockShowSuccessSnackBar).toHaveBeenCalledWith({
      message: 'Thèmes suivis\u00a0! Tu peux gérer tes alertes depuis ton profil.',
      timeout: SNACK_BAR_TIME_OUT,
    })
  })

  it('should log analytics on subscription success', async () => {
    mockServer.patchApi('/v1/profile', {})

    render(reactQueryProviderHOC(<OnboardingSubscription />))

    await user.press(screen.getByLabelText('Activités créatives'))
    await user.press(screen.getByText('Suivre la sélection'))

    expect(analytics.logSubscriptionUpdate).toHaveBeenCalledWith({ type: 'update', from: 'home' })
  })

  it('should show notifications settings modal when user has no notifications activated and click on subscribe button', async () => {
    // eslint-disable-next-line local-rules/independent-mocks
    mockAuthContextWithUser(
      {
        ...beneficiaryUser,
        subscriptions: {
          marketingEmail: false,
          marketingPush: false,
          subscribedThemes: [],
        },
      },
      { persist: true }
    )

    render(reactQueryProviderHOC(<OnboardingSubscription />))

    await user.press(screen.getByLabelText('Activités créatives'))
    await user.press(screen.getByLabelText('Suivre la sélection'))

    expect(screen.getByText('Autoriser l’envoi d’e-mails')).toBeOnTheScreen()
  })

  it('should save subscriptions when user subscribes from notifications settings modal', async () => {
    mockServer.patchApi('/v1/profile', {})
    mockAuthContextWithUser(
      {
        ...beneficiaryUser,
        subscriptions: { marketingEmail: false, marketingPush: false, subscribedThemes: [] },
      },
      { persist: true }
    )

    render(reactQueryProviderHOC(<OnboardingSubscription />))

    await user.press(screen.getByLabelText('Activités créatives'))
    await user.press(screen.getByLabelText('Suivre la sélection'))
    await user.press(screen.getByTestId('Interrupteur Autoriser l’envoi d’e-mails'))
    await user.press(screen.getByLabelText('Valider'))

    expect(patchProfileSpy).toHaveBeenCalledWith({
      subscriptions: {
        marketingEmail: true,
        marketingPush: false,
        subscribedThemes: [SubscriptionTheme.ACTIVITES],
      },
      origin: 'OnboardingSubscription',
    })
  })
})
