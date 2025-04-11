import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { navigateToHome } from 'features/navigation/helpers/navigateToHome'
import { TutorialRootStackParamList } from 'features/navigation/RootNavigator/types'
import { TutorialTypes, NonEligible } from 'features/tutorial/enums'
import { AgeSelectionFork } from 'features/tutorial/pages/onboarding/AgeSelectionFork'
import { analytics } from 'libs/analytics/__mocks__/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { eventMonitoring } from 'libs/monitoring/services'
import { storage } from 'libs/storage'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('features/navigation/helpers/navigateToHome')

const user = userEvent.setup()
jest.useFakeTimers()

describe('AgeSelectionFork', () => {
  beforeEach(async () => {
    setFeatureFlags()
    await storage.clear('user_age')
  })

  it('should render correctly', () => {
    renderAgeSelectionFork({ type: TutorialTypes.ONBOARDING })

    expect(screen).toMatchSnapshot()
  })

  it('should navigate to Home and send log when route.params are undefined', () => {
    renderAgeSelectionFork(undefined)

    expect(navigateToHome).toHaveBeenCalledTimes(1)
    expect(eventMonitoring.captureException).toHaveBeenCalledWith('route.params.type is undefined')
  })

  describe('onboarding', () => {
    beforeEach(() => {
      useRoute.mockReturnValueOnce({ params: { type: TutorialTypes.ONBOARDING } })
    })

    it('should render correctly', () => {
      renderAgeSelectionFork({ type: TutorialTypes.ONBOARDING })

      expect(screen).toMatchSnapshot()
    })

    it('should navigate to OnboardingNotEligible page when pressing "J’ai 16 ans ou moins"', async () => {
      renderAgeSelectionFork({ type: TutorialTypes.ONBOARDING })

      const button = screen.getByLabelText('J’ai 16 ans ou moins')
      await user.press(button)

      expect(navigate).toHaveBeenCalledWith('OnboardingStackNavigator', {
        screen: 'OnboardingNotEligible',
        params: undefined,
      })
    })

    it('should save user age to local storage when pressing "J’ai 16 ans ou moins"', async () => {
      renderAgeSelectionFork({ type: TutorialTypes.ONBOARDING })

      const button = screen.getByLabelText('J’ai 16 ans ou moins')
      await user.press(button)

      const userAge = await storage.readObject('user_age')

      expect(userAge).toBe(NonEligible.UNDER_17)
    })

    it('should navigate to OnboardingAgeInformation page when pressing "J’ai 17 ans"', async () => {
      renderAgeSelectionFork({ type: TutorialTypes.ONBOARDING })

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
      renderAgeSelectionFork({ type: TutorialTypes.ONBOARDING })

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
      renderAgeSelectionFork({ type: TutorialTypes.ONBOARDING })

      const button = screen.getByLabelText('J’ai 19 ans ou plus')
      await user.press(button)

      expect(analytics.logSelectAge).toHaveBeenCalledWith({ age: 'over_18', from: 'onboarding' })
    })
  })
})

const renderAgeSelectionFork = (navigationParams: { type: string } | undefined) => {
  const navProps = { route: { params: navigationParams } } as StackScreenProps<
    TutorialRootStackParamList,
    'AgeSelectionFork'
  >
  return render(<AgeSelectionFork {...navProps} />)
}
