import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'

import { reset } from '__mocks__/@react-navigation/native'
import { TutorialRootStackParamList } from 'features/navigation/RootNavigator/types'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { OnboardingWrapper } from 'features/tutorial/context/OnboardingWrapper'
import { NonEligible, Tutorial } from 'features/tutorial/enums'
import { AgeSelectionOther } from 'features/tutorial/pages/AgeSelectionOther'
import { analytics } from 'libs/analytics'
import { storage } from 'libs/storage'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

const mockShowModal = jest.fn()
jest.mock('ui/components/modals/useModal', () => ({
  useModal: () => ({
    visible: false,
    showModal: mockShowModal,
    hideModal: jest.fn(),
  }),
}))

describe('AgeSelectionOther', () => {
  beforeEach(async () => {
    await storage.clear('user_age')
  })

  describe('onboarding', () => {
    it('should render correctly', () => {
      renderAgeSelectionOther({ type: Tutorial.ONBOARDING })

      expect(screen).toMatchSnapshot()
    })

    it('should show modal when pressing "j’ai moins de 15 ans"', () => {
      renderAgeSelectionOther({ type: Tutorial.ONBOARDING })
      const button = screen.getByText('moins de 15 ans')

      fireEvent.press(button)
      expect(mockShowModal).toHaveBeenCalledTimes(1)
    })

    it('should show modal when pressing "j’ai plus de 18 ans"', () => {
      renderAgeSelectionOther({ type: Tutorial.ONBOARDING })

      const button = screen.getByText('plus de 18 ans')
      fireEvent.press(button)

      expect(mockShowModal).toHaveBeenCalledTimes(1)
    })

    it('should navigate to home when pressing "j’ai moins de 15 ans"', async () => {
      renderAgeSelectionOther({ type: Tutorial.ONBOARDING })

      const button = screen.getByText('moins de 15 ans')
      fireEvent.press(button)

      await waitFor(() => {
        expect(reset).toHaveBeenCalledWith({ index: 0, routes: [{ name: homeNavConfig[0] }] })
      })
    })

    it('should navigate to home when pressing "j’ai plus de 18 ans"', async () => {
      renderAgeSelectionOther({ type: Tutorial.ONBOARDING })

      const button = screen.getByText('plus de 18 ans')
      fireEvent.press(button)

      await waitFor(() => {
        expect(reset).toHaveBeenCalledWith({ index: 0, routes: [{ name: homeNavConfig[0] }] })
      })
    })

    it('should log analytics when pressing "j’ai moins de 15 ans"', () => {
      renderAgeSelectionOther({ type: Tutorial.ONBOARDING })

      const button = screen.getByText('moins de 15 ans')
      fireEvent.press(button)

      expect(analytics.logSelectAge).toHaveBeenCalledWith({
        age: NonEligible.UNDER_15,
        from: Tutorial.ONBOARDING,
      })
    })

    it('should log analytics when pressing "j’ai plus de 18 ans"', () => {
      renderAgeSelectionOther({ type: Tutorial.ONBOARDING })

      const button = screen.getByText('plus de 18 ans')
      fireEvent.press(button)

      expect(analytics.logSelectAge).toHaveBeenCalledWith({
        age: NonEligible.OVER_18,
        from: Tutorial.ONBOARDING,
      })
    })

    it('should save user age to local storage "j’ai moins de 15 ans"', async () => {
      renderAgeSelectionOther({ type: Tutorial.ONBOARDING })

      const button = screen.getByText('moins de 15 ans')
      fireEvent.press(button)

      const userAge = await storage.readObject('user_age')
      expect(userAge).toBe(NonEligible.UNDER_15)
    })

    it('should save user age to local storage when pressing "j’ai plus de 18 ans"', async () => {
      renderAgeSelectionOther({ type: Tutorial.ONBOARDING })

      const button = screen.getByText('plus de 18 ans')
      fireEvent.press(button)

      const userAge = await storage.readObject('user_age')
      expect(userAge).toBe(NonEligible.OVER_18)
    })
  })

  describe('profileTutorial', () => {
    it('should render correctly', () => {
      renderAgeSelectionOther({ type: Tutorial.PROFILE_TUTORIAL })

      expect(screen).toMatchSnapshot()
    })

    it('should show modal when pressing "j’ai moins de 15 ans"', () => {
      renderAgeSelectionOther({ type: Tutorial.PROFILE_TUTORIAL })
      const button = screen.getByText('moins de 15 ans')

      fireEvent.press(button)
      expect(mockShowModal).toHaveBeenCalledTimes(1)
    })

    it('should show modal when pressing "j’ai plus de 18 ans"', () => {
      renderAgeSelectionOther({ type: Tutorial.PROFILE_TUTORIAL })

      const button = screen.getByText('plus de 18 ans')
      fireEvent.press(button)

      expect(mockShowModal).toHaveBeenCalledTimes(1)
    })

    it('should not navigate to home when pressing "j’ai moins de 15 ans"', async () => {
      renderAgeSelectionOther({ type: Tutorial.PROFILE_TUTORIAL })

      const button = screen.getByText('moins de 15 ans')
      fireEvent.press(button)

      await waitFor(() => {
        expect(reset).not.toHaveBeenCalled()
      })
    })

    it('should not navigate to home when pressing "j’ai plus de 18 ans"', async () => {
      renderAgeSelectionOther({ type: Tutorial.PROFILE_TUTORIAL })

      const button = screen.getByText('plus de 18 ans')
      fireEvent.press(button)

      await waitFor(() => {
        expect(reset).not.toHaveBeenCalled()
      })
    })

    it('should log analytics when pressing "j’ai moins de 15 ans"', () => {
      renderAgeSelectionOther({ type: Tutorial.PROFILE_TUTORIAL })

      const button = screen.getByText('moins de 15 ans')
      fireEvent.press(button)

      expect(analytics.logSelectAge).toHaveBeenCalledWith({
        age: NonEligible.UNDER_15,
        from: Tutorial.PROFILE_TUTORIAL,
      })
    })

    it('should log analytics when pressing "j’ai plus de 18 ans"', () => {
      renderAgeSelectionOther({ type: Tutorial.PROFILE_TUTORIAL })

      const button = screen.getByText('plus de 18 ans')
      fireEvent.press(button)

      expect(analytics.logSelectAge).toHaveBeenCalledWith({
        age: NonEligible.OVER_18,
        from: Tutorial.PROFILE_TUTORIAL,
      })
    })

    it('should not save user age to local storage "j’ai moins de 15 ans"', async () => {
      renderAgeSelectionOther({ type: Tutorial.PROFILE_TUTORIAL })

      const button = screen.getByText('moins de 15 ans')
      fireEvent.press(button)

      const userAge = await storage.readObject('user_age')
      expect(userAge).toBeNull()
    })

    it('should not save user age to local storage when pressing "j’ai plus de 18 ans"', async () => {
      renderAgeSelectionOther({ type: Tutorial.PROFILE_TUTORIAL })

      const button = screen.getByText('plus de 18 ans')
      fireEvent.press(button)

      const userAge = await storage.readObject('user_age')
      expect(userAge).toBeNull()
    })
  })
})

const renderAgeSelectionOther = (navigationParams: { type: string }) => {
  const navProps = { route: { params: navigationParams } } as StackScreenProps<
    TutorialRootStackParamList,
    'AgeSelection'
  >
  return render(
    <OnboardingWrapper>
      <AgeSelectionOther {...navProps} />
    </OnboardingWrapper>
  )
}
