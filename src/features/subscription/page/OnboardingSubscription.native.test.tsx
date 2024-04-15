import React from 'react'

import * as API from 'api/api'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { mockGoBack } from 'features/navigation/__mocks__/useGoBack'
import { OnboardingSubscription } from 'features/subscription/page/OnboardingSubscription'
import { SubscriptionTheme } from 'features/subscription/types'
import { beneficiaryUser } from 'fixtures/user'
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

mockUseAuthContext.mockReturnValue(baseAuthContext)

const postProfileSpy = jest.spyOn(API.api, 'postNativeV1Profile')

describe('OnboardingSubscription', () => {
  it('should render correctly', () => {
    render(reactQueryProviderHOC(<OnboardingSubscription />))

    expect(screen).toMatchSnapshot()
  })

  it('should go back when user presses "Non merci"', () => {
    render(reactQueryProviderHOC(<OnboardingSubscription />))

    fireEvent.press(screen.getByText('Non merci'))

    expect(mockGoBack).toHaveBeenCalledTimes(1)
  })

  it('should check theme when user presses a category button', () => {
    render(reactQueryProviderHOC(<OnboardingSubscription />))

    fireEvent.press(screen.getByLabelText('Activités créatives'))

    expect(screen.getByLabelText('Activités créatives')).toHaveAccessibilityState({ checked: true })
  })

  it('should precheck themes when user has already subscribed to some', () => {
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

    expect(screen.getByLabelText('Musique')).toHaveAccessibilityState({ checked: true })
  })

  it('should disable validate button when no theme is selected', () => {
    render(reactQueryProviderHOC(<OnboardingSubscription />))

    expect(screen.getByText('Suivre la sélection')).toBeDisabled()
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
})
