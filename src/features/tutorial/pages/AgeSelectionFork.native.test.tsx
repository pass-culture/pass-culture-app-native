import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { setSettings } from 'features/auth/tests/setSettings'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { TutorialRootStackParamList } from 'features/navigation/RootNavigator/types'
import { TutorialTypes, NonEligible } from 'features/tutorial/enums'
import { AgeSelectionFork } from 'features/tutorial/pages/AgeSelectionFork'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
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

  describe('onboarding', () => {
    beforeEach(() => {
      useRoute.mockReturnValueOnce({ params: { type: TutorialTypes.ONBOARDING } })
    })

    it('should navigate to Home page when pressing "J’ai 14 ans ou moins"', async () => {
      renderAgeSelectionFork({ type: TutorialTypes.ONBOARDING })

      const button = screen.getByLabelText('J’ai 14 ans ou moins')
      await user.press(button)

      expect(navigate).toHaveBeenCalledWith(navigateToHomeConfig.screen, {
        type: TutorialTypes.ONBOARDING,
        screen: 'Home',
      })
    })

    it('should save user age to local storage when pressing "J’ai 14 ans ou moins"', async () => {
      renderAgeSelectionFork({ type: TutorialTypes.ONBOARDING })

      const button = screen.getByLabelText('J’ai 14 ans ou moins')
      await user.press(button)

      const userAge = await storage.readObject('user_age')

      expect(userAge).toBe(NonEligible.UNDER_15)
    })

    it('should navigate to EligibleUserAgeSelection page when pressing "J’ai entre 15 et 18 ans"', async () => {
      renderAgeSelectionFork({ type: TutorialTypes.ONBOARDING })

      const button = screen.getByLabelText('J’ai entre 15 et 18 ans')
      await user.press(button)

      expect(navigate).toHaveBeenCalledWith('EligibleUserAgeSelection', {
        type: TutorialTypes.ONBOARDING,
      })
    })

    it('should navigate to OnboardingGeneralPublicWelcome page when pressing "J’ai 19 ans ou plus"', async () => {
      renderAgeSelectionFork({ type: TutorialTypes.ONBOARDING })

      const button = screen.getByLabelText('J’ai 19 ans ou plus')
      await user.press(button)

      expect(navigate).toHaveBeenCalledWith('OnboardingGeneralPublicWelcome', {
        type: TutorialTypes.ONBOARDING,
      })
    })

    it('should save user age to local storage when pressing "J’ai 19 ans ou plus"', async () => {
      renderAgeSelectionFork({ type: TutorialTypes.ONBOARDING })

      const button = screen.getByLabelText('J’ai 19 ans ou plus')
      await user.press(button)

      const userAge = await storage.readObject('user_age')

      expect(userAge).toBe(NonEligible.OVER_18)
    })
  })

  describe('profileTutorial', () => {
    beforeEach(() => {
      useRoute.mockReturnValueOnce({ params: { type: TutorialTypes.PROFILE_TUTORIAL } })
    })

    it('should navigate to Home page when pressing "J’ai 14 ans ou moins"', async () => {
      renderAgeSelectionFork({ type: TutorialTypes.PROFILE_TUTORIAL })

      const button = screen.getByLabelText('J’ai 14 ans ou moins')
      await user.press(button)

      expect(navigate).toHaveBeenCalledWith(navigateToHomeConfig.screen, {
        type: TutorialTypes.PROFILE_TUTORIAL,
        screen: 'Home',
      })
    })

    it('should navigate to EligibleUserAgeSelection page when pressing "J’ai entre 15 et 18 ans"', async () => {
      renderAgeSelectionFork({ type: TutorialTypes.PROFILE_TUTORIAL })

      const button = screen.getByLabelText('J’ai entre 15 et 18 ans')
      await user.press(button)

      expect(navigate).toHaveBeenCalledWith('EligibleUserAgeSelection', {
        type: TutorialTypes.PROFILE_TUTORIAL,
      })
    })

    it('should navigate to OnboardingGeneralPublicWelcome page when pressing "J’ai 19 ans ou plus"', async () => {
      renderAgeSelectionFork({ type: TutorialTypes.PROFILE_TUTORIAL })

      const button = screen.getByLabelText('J’ai 19 ans ou plus')
      await user.press(button)

      expect(navigate).toHaveBeenCalledWith('OnboardingGeneralPublicWelcome', {
        type: TutorialTypes.PROFILE_TUTORIAL,
      })
    })
  })

  describe('when enableCreditV3 activated', () => {
    beforeEach(() => {
      setSettings({ wipEnableCreditV3: true })
    })

    describe('onboarding', () => {
      beforeEach(() => {
        useRoute.mockReturnValueOnce({ params: { type: TutorialTypes.ONBOARDING } })
      })

      it('should render correctly', () => {
        renderAgeSelectionFork({ type: TutorialTypes.ONBOARDING })

        expect(screen).toMatchSnapshot()
      })

      it('should navigate to OnboardingNonEligible page when pressing "J’ai 16 ans ou moins"', async () => {
        renderAgeSelectionFork({ type: TutorialTypes.ONBOARDING })

        const button = screen.getByLabelText('J’ai 16 ans ou moins')
        await user.press(button)

        expect(navigate).toHaveBeenCalledWith('OnboardingNonEligible', {
          type: TutorialTypes.ONBOARDING,
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

        expect(navigate).toHaveBeenCalledWith('OnboardingAgeInformation', {
          age: 17,
          type: TutorialTypes.ONBOARDING,
        })
      })

      it('should navigate to OnboardingAgeInformation page when pressing "J’ai 18 ans"', async () => {
        renderAgeSelectionFork({ type: TutorialTypes.ONBOARDING })

        const button = screen.getByLabelText('J’ai 18 ans')
        await user.press(button)

        expect(navigate).toHaveBeenCalledWith('OnboardingAgeInformation', {
          age: 18,
          type: TutorialTypes.ONBOARDING,
        })
      })
    })
  })
})

const renderAgeSelectionFork = (navigationParams: { type: string }) => {
  const navProps = { route: { params: navigationParams } } as StackScreenProps<
    TutorialRootStackParamList,
    'AgeSelectionFork'
  >
  return render(<AgeSelectionFork {...navProps} />)
}
