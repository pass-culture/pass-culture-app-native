import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { TutorialRootStackParamList } from 'features/navigation/RootNavigator/types'
import { TutorialTypes } from 'features/tutorial/enums'
import { AgeSelectionFork } from 'features/tutorial/pages/AgeSelectionFork'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('features/navigation/helpers/navigateToHome')

describe('AgeSelectionFork', () => {
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
      fireEvent.press(button)

      await waitFor(() => {
        expect(navigate).toHaveBeenCalledWith(navigateToHomeConfig.screen, {
          type: TutorialTypes.ONBOARDING,
        })
      })
    })

    it('should navigate to EligibleUserAgeSelection page when pressing "J’ai entre 15 et 18 ans"', () => {
      renderAgeSelectionFork({ type: TutorialTypes.ONBOARDING })

      const button = screen.getByLabelText('J’ai entre 15 et 18 ans')
      fireEvent.press(button)

      expect(navigate).toHaveBeenCalledWith('EligibleUserAgeSelection', {
        type: TutorialTypes.ONBOARDING,
      })
    })

    it('should navigate to OnboardingGeneralPublicWelcome page when pressing "J’ai 19 ans ou plus"', () => {
      renderAgeSelectionFork({ type: TutorialTypes.ONBOARDING })

      const button = screen.getByLabelText('J’ai 19 ans ou plus')
      fireEvent.press(button)

      expect(navigate).toHaveBeenCalledWith('OnboardingGeneralPublicWelcome', {
        type: TutorialTypes.ONBOARDING,
      })
    })
  })

  describe('profileTutorial', () => {
    beforeEach(() => {
      useRoute.mockReturnValueOnce({ params: { type: TutorialTypes.PROFILE_TUTORIAL } })
    })

    it('should navigate to Home page when pressing "J’ai 14 ans ou moins"', async () => {
      renderAgeSelectionFork({ type: TutorialTypes.PROFILE_TUTORIAL })

      const button = screen.getByLabelText('J’ai 14 ans ou moins')
      fireEvent.press(button)

      await waitFor(() => {
        expect(navigate).toHaveBeenCalledWith(navigateToHomeConfig.screen, {
          type: TutorialTypes.PROFILE_TUTORIAL,
        })
      })
    })

    it('should navigate to EligibleUserAgeSelection page when pressing "J’ai entre 15 et 18 ans"', () => {
      renderAgeSelectionFork({ type: TutorialTypes.PROFILE_TUTORIAL })

      const button = screen.getByLabelText('J’ai entre 15 et 18 ans')
      fireEvent.press(button)

      expect(navigate).toHaveBeenCalledWith('EligibleUserAgeSelection', {
        type: TutorialTypes.PROFILE_TUTORIAL,
      })
    })

    it('should navigate to OnboardingGeneralPublicWelcome page when pressing "J’ai 19 ans ou plus"', () => {
      renderAgeSelectionFork({ type: TutorialTypes.PROFILE_TUTORIAL })

      const button = screen.getByLabelText('J’ai 19 ans ou plus')
      fireEvent.press(button)

      expect(navigate).toHaveBeenCalledWith('OnboardingGeneralPublicWelcome', {
        type: TutorialTypes.PROFILE_TUTORIAL,
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
