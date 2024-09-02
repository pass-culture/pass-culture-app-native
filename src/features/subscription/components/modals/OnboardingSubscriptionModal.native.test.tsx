import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { OnboardingSubscriptionModal } from 'features/subscription/components/modals/OnboardingSubscriptionModal'
import { screen, render, fireEvent, waitFor } from 'tests/utils'

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

describe('<OnboardingSubscriptionModal />', () => {
  it('should display correctly', () => {
    render(<OnboardingSubscriptionModal visible dismissModal={jest.fn()} />)

    expect(screen).toMatchSnapshot()
  })

  it('should navigate when pressing "Choisir des thèmes à suivre"', async () => {
    render(<OnboardingSubscriptionModal visible dismissModal={jest.fn()} />)

    fireEvent.press(screen.getByText('Choisir des thèmes à suivre'))

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('OnboardingSubscription', undefined)
    })
  })

  it('should dismiss modal when pressing "Non merci"', async () => {
    const mockDismissModal = jest.fn()
    render(<OnboardingSubscriptionModal visible dismissModal={mockDismissModal} />)

    fireEvent.press(screen.getByText('Non merci'))

    await waitFor(() => {
      expect(mockDismissModal).toHaveBeenCalledTimes(1)
    })
  })
})
