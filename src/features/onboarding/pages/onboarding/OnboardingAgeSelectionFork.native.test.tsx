import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { NonEligible } from 'features/onboarding/enums'
import { OnboardingAgeSelectionFork } from 'features/onboarding/pages/onboarding/OnboardingAgeSelectionFork'
import { analytics } from 'libs/analytics/__mocks__/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { storage } from 'libs/storage'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('features/navigation/helpers/navigateToHome')

const user = userEvent.setup()
jest.useFakeTimers()

describe('OnboardingAgeSelectionFork', () => {
  beforeEach(async () => {
    setFeatureFlags()
    await storage.clear('user_age')
  })

  it('should render correctly', () => {
    render(<OnboardingAgeSelectionFork />)

    expect(screen).toMatchSnapshot()
  })

  it('should navigate to OnboardingNotEligible page when pressing "J’ai 16 ans ou moins"', async () => {
    render(<OnboardingAgeSelectionFork />)

    const button = screen.getByLabelText('J’ai 16 ans ou moins')
    await user.press(button)

    expect(navigate).toHaveBeenCalledWith('OnboardingStackNavigator', {
      screen: 'OnboardingNotEligible',
      params: undefined,
    })
  })

  it('should save user age to local storage when pressing "J’ai 16 ans ou moins"', async () => {
    render(<OnboardingAgeSelectionFork />)

    const button = screen.getByLabelText('J’ai 16 ans ou moins')
    await user.press(button)

    const userAge = await storage.readObject('user_age')

    expect(userAge).toBe(NonEligible.UNDER_17)
  })

  it('should navigate to OnboardingAgeInformation page when pressing "J’ai 17 ans"', async () => {
    render(<OnboardingAgeSelectionFork />)

    const button = screen.getByLabelText('J’ai 17 ans')
    await user.press(button)

    expect(navigate).toHaveBeenCalledWith('OnboardingStackNavigator', {
      screen: 'OnboardingAgeInformation',
      params: {
        age: 17,
      },
    })
  })

  it('should navigate to OnboardingAgeInformation page when pressing "J’ai 18 ans"', async () => {
    render(<OnboardingAgeSelectionFork />)

    const button = screen.getByLabelText('J’ai 18 ans')
    await user.press(button)

    expect(navigate).toHaveBeenCalledWith('OnboardingStackNavigator', {
      screen: 'OnboardingAgeInformation',
      params: {
        age: 18,
      },
    })
  })

  it('should call logSelectAge', async () => {
    render(<OnboardingAgeSelectionFork />)

    const button = screen.getByLabelText('J’ai 19 ans ou plus')
    await user.press(button)

    expect(analytics.logSelectAge).toHaveBeenCalledWith({ age: 'over_18' })
  })
})
