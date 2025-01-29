import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { TutorialRootStackParamList } from 'features/navigation/RootNavigator/types'
import * as useGoBack from 'features/navigation/useGoBack'
import { TutorialTypes } from 'features/tutorial/enums'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { storage } from 'libs/storage'
import { render, screen, userEvent } from 'tests/utils'

import { EligibleUserAgeSelection } from './EligibleUserAgeSelection'

const AGES = [15, 16, 17, 18]

jest.mock('features/navigation/navigationRef')

jest.spyOn(useGoBack, 'useGoBack').mockReturnValue({
  goBack: jest.fn(),
  canGoBack: jest.fn(() => true),
})

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()
jest.useFakeTimers()

describe('EligibleUserAgeSelection', () => {
  describe('with passForAll feature flag off', () => {
    beforeEach(async () => {
      await storage.clear('user_age')
      setFeatureFlags()
    })

    describe('onboarding', () => {
      it('should render correctly', () => {
        renderEligibleUserAgeSelection({ type: TutorialTypes.ONBOARDING })

        expect(screen).toMatchSnapshot()
      })

      it.each(AGES)(
        'should navigate to OnboardingAgeInformation page with params age=%s when pressing "j’ai %s ans"',
        async (age) => {
          renderEligibleUserAgeSelection({ type: TutorialTypes.ONBOARDING })

          const button = screen.getByText(`${age} ans`)
          await user.press(button)

          expect(navigate).toHaveBeenCalledWith('OnboardingAgeInformation', { age })
        }
      )

      it('should navigate to AgeSelectionOther page when pressing "Autre"', async () => {
        useRoute.mockReturnValueOnce({ params: { type: TutorialTypes.ONBOARDING } })
        renderEligibleUserAgeSelection({ type: TutorialTypes.ONBOARDING })

        const button = screen.getByText('Autre')
        await user.press(button)

        expect(navigate).toHaveBeenCalledWith('AgeSelectionOther', {
          type: TutorialTypes.ONBOARDING,
        })
      })

      it.each(AGES)(
        'should log analytics with params age=%s when pressing "j’ai %s ans"',
        async (age) => {
          renderEligibleUserAgeSelection({ type: TutorialTypes.ONBOARDING })

          const button = screen.getByText(`${age} ans`)
          await user.press(button)

          expect(analytics.logSelectAge).toHaveBeenCalledWith({
            age: age,
            from: TutorialTypes.ONBOARDING,
          })
        }
      )

      it('should log analytics when pressing "Autre"', async () => {
        renderEligibleUserAgeSelection({ type: TutorialTypes.ONBOARDING })

        const button = screen.getByText('Autre')
        await user.press(button)

        expect(analytics.logSelectAge).toHaveBeenCalledWith({
          age: 'other',
          from: TutorialTypes.ONBOARDING,
        })
      })

      it.each(AGES)(
        'should set user age to %s in local storage  when pressing "j’ai %s ans"',
        async (age) => {
          renderEligibleUserAgeSelection({ type: TutorialTypes.ONBOARDING })

          const button = screen.getByText(`${age} ans`)
          await user.press(button)

          const userAge = await storage.readObject('user_age')

          expect(userAge).toBe(age)
        }
      )
    })

    describe('profileTutorial', () => {
      it('should render correctly', () => {
        renderEligibleUserAgeSelection({ type: TutorialTypes.PROFILE_TUTORIAL })

        expect(screen).toMatchSnapshot()
      })

      it.each(AGES)(
        'should navigate to ProfileTutorialAgeInformation page with params age=%s when pressing "à %s ans"',
        async (age) => {
          renderEligibleUserAgeSelection({ type: TutorialTypes.PROFILE_TUTORIAL })

          const button = screen.getByText(`à ${age} ans`)
          await user.press(button)

          expect(navigate).toHaveBeenCalledWith('ProfileTutorialAgeInformation', {
            age,
          })
        }
      )

      it.each(AGES)(
        'should log analytics with params age=%s when pressing "j’ai %s ans"',
        async (age) => {
          renderEligibleUserAgeSelection({ type: TutorialTypes.PROFILE_TUTORIAL })

          const button = screen.getByText(`${age} ans`)
          await user.press(button)

          expect(analytics.logSelectAge).toHaveBeenCalledWith({
            age: age,
            from: TutorialTypes.PROFILE_TUTORIAL,
          })
        }
      )
    })
  })

  describe('with passForAll feature flag on', () => {
    beforeEach(async () => {
      await storage.clear('user_age')
      setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_PASS_FOR_ALL])
    })

    describe('onboarding', () => {
      it('should render correctly', () => {
        renderEligibleUserAgeSelection({ type: TutorialTypes.ONBOARDING })

        expect(screen).toMatchSnapshot()
      })
    })
  })
})

const renderEligibleUserAgeSelection = (navigationParams: { type: string }) => {
  const navProps = { route: { params: navigationParams } } as StackScreenProps<
    TutorialRootStackParamList,
    'EligibleUserAgeSelection'
  >
  return render(<EligibleUserAgeSelection {...navProps} />)
}
