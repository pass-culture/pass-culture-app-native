import React from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { mockGoBack } from 'features/navigation/__mocks__/useGoBack'
import { OnboardingSubscription } from 'features/subscription/page/OnboardingSubscription'
import { SubscriptionTheme } from 'features/subscription/types'
import { beneficiaryUser } from 'fixtures/user'
import { fireEvent, render, screen } from 'tests/utils'

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

describe('OnboardingSubscription', () => {
  it('should render correctly', () => {
    render(<OnboardingSubscription />)

    expect(screen).toMatchSnapshot()
  })

  it('should go back when user presses "Non merci"', () => {
    render(<OnboardingSubscription />)

    fireEvent.press(screen.getByText('Non merci'))

    expect(mockGoBack).toHaveBeenCalledTimes(1)
  })

  it('should toggle theme when user presses a category button', () => {
    render(<OnboardingSubscription />)

    fireEvent.press(screen.getByLabelText('Activités créatives'))

    expect(screen.getByLabelText('Activités créatives')).toHaveAccessibilityState({ checked: true })
  })

  it('should pretoggle themes when user has already subscribed to some', () => {
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
    render(<OnboardingSubscription />)

    expect(screen.getByLabelText('Musique')).toHaveAccessibilityState({ checked: true })
  })
})
