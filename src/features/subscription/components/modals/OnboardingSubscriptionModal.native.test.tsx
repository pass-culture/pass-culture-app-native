import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { OnboardingSubscriptionModal } from 'features/subscription/components/modals/OnboardingSubscriptionModal'
import { screen, render, userEvent } from 'tests/utils'

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})
const user = userEvent.setup()
jest.useFakeTimers()

describe('<OnboardingSubscriptionModal />', () => {
  it('should display correctly', () => {
    render(<OnboardingSubscriptionModal visible dismissModal={jest.fn()} />)

    expect(screen).toMatchSnapshot()
  })

  it('should navigate when pressing "Choisir des thèmes à suivre"', async () => {
    render(<OnboardingSubscriptionModal visible dismissModal={jest.fn()} />)

    await user.press(screen.getByText('Choisir des thèmes à suivre'))

    expect(navigate).toHaveBeenCalledWith('OnboardingSubscription', undefined)
  })

  it('should dismiss modal when pressing "Non merci"', async () => {
    const mockDismissModal = jest.fn()
    render(<OnboardingSubscriptionModal visible dismissModal={mockDismissModal} />)

    await user.press(screen.getByText('Non merci'))

    expect(mockDismissModal).toHaveBeenCalledTimes(1)
  })
})
