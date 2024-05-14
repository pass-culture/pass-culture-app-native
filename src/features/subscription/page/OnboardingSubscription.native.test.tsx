import React from 'react'

import { replace } from '__mocks__/@react-navigation/native'
import * as API from 'api/api'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import * as useGoBack from 'features/navigation/useGoBack'
import { OnboardingSubscription } from 'features/subscription/page/OnboardingSubscription'
import { SubscriptionTheme } from 'features/subscription/types'
import { beneficiaryUser } from 'fixtures/user'
import { analytics } from 'libs/analytics'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen, waitFor } from 'tests/utils'

jest.mock('features/auth/context/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>

const baseAuthContext = {
  isLoggedIn: true,
  setIsLoggedIn: jest.fn(),
  user: beneficiaryUser,
  refetchUser: jest.fn(),
  isUserLoading: false,
}

const postProfileSpy = jest.spyOn(API.api, 'postNativeV1Profile')

const mockGoBack = jest.fn()
jest.spyOn(useGoBack, 'useGoBack').mockReturnValue({
  goBack: mockGoBack,
  canGoBack: jest.fn(() => true),
})

describe('OnboardingSubscription', () => {
  beforeEach(() => mockUseAuthContext.mockReturnValue(baseAuthContext))

  it('should render correctly', async () => {
    render(reactQueryProviderHOC(<OnboardingSubscription />))

    await screen.findByText('Choisis des thèmes à suivre')

    expect(screen).toMatchSnapshot()
  })

  it('should go back when user presses "Non merci"', async () => {
    render(reactQueryProviderHOC(<OnboardingSubscription />))

    fireEvent.press(await screen.findByLabelText('Ne pas suivre de thème'))

    expect(mockGoBack).toHaveBeenCalledTimes(1)
  })

  it('should check theme when user presses a category button', async () => {
    render(reactQueryProviderHOC(<OnboardingSubscription />))

    fireEvent.press(await screen.findByLabelText('Activités créatives'))

    expect(screen.getByLabelText('Activités créatives')).toHaveAccessibilityState({ checked: true })
  })

  it('should precheck themes when user has already subscribed to some', async () => {
    mockUseAuthContext.mockReturnValueOnce({
      ...baseAuthContext,
      user: {
        ...beneficiaryUser,
        subscriptions: {
          marketingEmail: true,
          marketingPush: true,
          subscribedThemes: [SubscriptionTheme.MUSIQUE],
        },
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
    mockServer.postApi('/v1/profile', {})

    render(reactQueryProviderHOC(<OnboardingSubscription />))

    await act(async () => fireEvent.press(screen.getByLabelText('Activités créatives')))

    fireEvent.press(screen.getByText('Suivre la sélection'))

    await waitFor(() => {
      expect(postProfileSpy).toHaveBeenCalledWith({
        subscriptions: {
          marketingEmail: true,
          marketingPush: true,
          subscribedThemes: [SubscriptionTheme.ACTIVITES],
        },
      })
    })
  })

  it('should navigate to home on subscription success', async () => {
    mockServer.postApi('/v1/profile', {})

    render(reactQueryProviderHOC(<OnboardingSubscription />))

    fireEvent.press(await screen.findByLabelText('Activités créatives'))
    fireEvent.press(screen.getByText('Suivre la sélection'))

    await waitFor(() => {
      expect(replace).toHaveBeenCalledWith(...homeNavConfig)
    })
  })

  it('should log analytics on subscription success', async () => {
    mockServer.postApi('/v1/profile', {})

    render(reactQueryProviderHOC(<OnboardingSubscription />))

    fireEvent.press(await screen.findByLabelText('Activités créatives'))
    fireEvent.press(screen.getByText('Suivre la sélection'))

    await waitFor(() => {
      expect(analytics.logSubscriptionUpdate).toHaveBeenCalledWith({ type: 'update', from: 'home' })
    })
  })

  it('should show notifications settings modal when user has no notifications activated and click on subscribe button', async () => {
    // eslint-disable-next-line local-rules/independent-mocks
    mockUseAuthContext.mockReturnValue({
      ...baseAuthContext,
      isLoggedIn: true,
      user: {
        ...beneficiaryUser,
        subscriptions: {
          marketingEmail: false,
          marketingPush: false,
          subscribedThemes: [],
        },
      },
    })

    render(reactQueryProviderHOC(<OnboardingSubscription />))

    fireEvent.press(await screen.findByLabelText('Activités créatives'))
    fireEvent.press(screen.getByLabelText('Suivre la sélection'))

    expect(screen.getByText('Autoriser l’envoi d’e-mails')).toBeOnTheScreen()
  })

  it('should save subscriptions when user subscribes from notifications settings modal', async () => {
    mockServer.postApi('/v1/profile', {})
    // eslint-disable-next-line local-rules/independent-mocks
    mockUseAuthContext.mockReturnValue({
      ...baseAuthContext,
      isLoggedIn: true,
      user: {
        ...beneficiaryUser,
        subscriptions: {
          marketingEmail: false,
          marketingPush: false,
          subscribedThemes: [],
        },
      },
    })

    render(reactQueryProviderHOC(<OnboardingSubscription />))

    fireEvent.press(await screen.findByLabelText('Activités créatives'))
    fireEvent.press(screen.getByLabelText('Suivre la sélection'))
    fireEvent.press(screen.getByTestId('Interrupteur Autoriser l’envoi d’e-mails'))
    fireEvent.press(screen.getByLabelText('Valider'))

    await waitFor(() => {
      expect(postProfileSpy).toHaveBeenCalledWith({
        subscriptions: {
          marketingEmail: true,
          marketingPush: false,
          subscribedThemes: [SubscriptionTheme.ACTIVITES],
        },
      })
    })
  })
})
