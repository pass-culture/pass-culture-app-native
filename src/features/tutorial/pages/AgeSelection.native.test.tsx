import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { TutorialRootStackParamList } from 'features/navigation/RootNavigator/types'
import { Tutorial } from 'features/tutorial/enums'
import { analytics } from 'libs/analytics'
import { storage } from 'libs/storage'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

import { AgeSelection } from './AgeSelection'

const AGES = [15, 16, 17, 18]

jest.mock('features/navigation/navigationRef')

describe('AgeSelection', () => {
  beforeEach(async () => {
    await storage.clear('user_age')
  })

  describe('onboarding', () => {
    it('should render correctly', () => {
      renderAgeSelection({ type: Tutorial.ONBOARDING })

      expect(screen).toMatchSnapshot()
    })

    it.each(AGES)(
      'should navigate to OnboardingAgeInformation page with params age=%s when pressing "j’ai %s ans"',
      async (age) => {
        renderAgeSelection({ type: Tutorial.ONBOARDING })

        const button = screen.getByText(`${age} ans`)
        fireEvent.press(button)

        await waitFor(() => {
          expect(navigate).toHaveBeenCalledWith('OnboardingAgeInformation', { age })
        })
      }
    )

    it('should navigate to AgeSelectionOther page when pressing "Autre"', async () => {
      useRoute.mockReturnValueOnce({ params: { type: Tutorial.ONBOARDING } })
      renderAgeSelection({ type: Tutorial.ONBOARDING })

      const button = screen.getByText('Autre')
      fireEvent.press(button)

      await waitFor(() => {
        expect(navigate).toHaveBeenCalledWith('AgeSelectionOther', { type: Tutorial.ONBOARDING })
      })
    })

    it.each(AGES)('should log analytics with params age=%s when pressing "j’ai %s ans"', (age) => {
      renderAgeSelection({ type: Tutorial.ONBOARDING })

      const button = screen.getByText(`${age} ans`)
      fireEvent.press(button)

      expect(analytics.logSelectAge).toHaveBeenCalledWith({ age, from: Tutorial.ONBOARDING })
    })

    it('should log analytics when pressing "Autre"', () => {
      renderAgeSelection({ type: Tutorial.ONBOARDING })

      const button = screen.getByText('Autre')
      fireEvent.press(button)

      expect(analytics.logSelectAge).toHaveBeenCalledWith({
        age: 'other',
        from: Tutorial.ONBOARDING,
      })
    })

    it.each(AGES)(
      'should set user age to %s in local storage  when pressing "j’ai %s ans"',
      async (age) => {
        renderAgeSelection({ type: Tutorial.ONBOARDING })

        const button = screen.getByText(`${age} ans`)
        fireEvent.press(button)

        const userAge = await storage.readObject('user_age')
        expect(userAge).toBe(age)
      }
    )
  })

  describe('profileTutorial', () => {
    it('should render correctly', () => {
      renderAgeSelection({ type: Tutorial.PROFILE_TUTORIAL })

      expect(screen).toMatchSnapshot()
    })

    it.each(AGES)('should log analytics with params age=%s when pressing "j’ai %s ans"', (age) => {
      renderAgeSelection({ type: Tutorial.PROFILE_TUTORIAL })

      const button = screen.getByText(`${age} ans`)
      fireEvent.press(button)

      expect(analytics.logSelectAge).toHaveBeenCalledWith({ age, from: Tutorial.PROFILE_TUTORIAL })
    })
  })
})

const renderAgeSelection = (navigationParams: { type: string }) => {
  const navProps = { route: { params: navigationParams } } as StackScreenProps<
    TutorialRootStackParamList,
    'AgeSelection'
  >
  return render(<AgeSelection {...navProps} />)
}
