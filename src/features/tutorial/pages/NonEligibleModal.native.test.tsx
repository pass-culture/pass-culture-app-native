import React from 'react'

import { setSettings } from 'features/auth/tests/setSettings'
import { navigateToHome } from 'features/navigation/helpers/navigateToHome'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { NonEligible, TutorialTypes } from 'features/tutorial/enums'
import { NonEligibleModal } from 'features/tutorial/pages/NonEligibleModal'
import { env } from 'libs/environment/fixtures'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { userEvent, render, screen } from 'tests/utils'

jest.mock('features/navigation/helpers/navigateToHome')
const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')
const hideModal = jest.fn()

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()
jest.useFakeTimers()

describe('NonEligibleModal', () => {
  beforeEach(() => setFeatureFlags())

  it('should display subtitle with credit V2', () => {
    renderNonEligibleModal(NonEligible.UNDER_15, TutorialTypes.ONBOARDING)

    const subtitle = 'Tu peux bénéficier de ton crédit sur l’application à partir de tes 15 ans.'

    expect(screen.getByText(subtitle)).toBeOnTheScreen()
  })

  describe('for user over 18 years old', () => {
    it('should return null', () => {
      renderNonEligibleModal(NonEligible.OVER_18, TutorialTypes.ONBOARDING)

      expect(screen.toJSON()).toBeNull()
    })
  })

  describe('for user under 15 years old', () => {
    it('should render correctly for onboarding', () => {
      renderNonEligibleModal(NonEligible.UNDER_15, TutorialTypes.ONBOARDING)

      expect(screen).toMatchSnapshot()
    })

    it('should render correctly for profile tutorial', () => {
      renderNonEligibleModal(NonEligible.UNDER_15, TutorialTypes.PROFILE_TUTORIAL)

      expect(screen).toMatchSnapshot()
    })

    it('should close modal when pressing right header icon', async () => {
      renderNonEligibleModal(NonEligible.UNDER_15, TutorialTypes.ONBOARDING)

      const button = screen.getByTestId('Fermer la modale')
      await user.press(button)

      expect(hideModal).toHaveBeenCalledTimes(1)
    })

    it('should close modal when pressing "Explorer le catalogue" on onboarding', async () => {
      renderNonEligibleModal(NonEligible.UNDER_15, TutorialTypes.ONBOARDING)

      const button = screen.getByText('Explorer le catalogue')
      await user.press(button)

      expect(hideModal).toHaveBeenCalledTimes(1)
    })

    it('should navigate to home when pressing "Explorer le catalogue" on profile tutorial', async () => {
      renderNonEligibleModal(NonEligible.UNDER_15, TutorialTypes.PROFILE_TUTORIAL)

      const button = screen.getByText('Explorer le catalogue')
      await user.press(button)

      expect(navigateToHome).toHaveBeenCalledTimes(1)
    })

    it('should not navigate to home when pressing "Explorer le catalogue" on onboarding', async () => {
      renderNonEligibleModal(NonEligible.UNDER_15, TutorialTypes.ONBOARDING)

      const button = screen.getByText('Explorer le catalogue')
      await user.press(button)

      expect(navigateToHome).not.toHaveBeenCalled()
    })

    it('should redirect to FAQ when pressing "comment ça marche ?" on onboarding', async () => {
      renderNonEligibleModal(NonEligible.UNDER_15, TutorialTypes.ONBOARDING)

      const button = screen.getByText('comment ça marche\u00a0?')
      await user.press(button)

      expect(openUrl).toHaveBeenCalledWith(env.FAQ_LINK_CREDIT)
    })

    describe('when enableCreditV3 activated', () => {
      beforeEach(() => {
        setSettings({ wipEnableCreditV3: true })
      })

      it('should display subtitle with credit V3', () => {
        renderNonEligibleModal(NonEligible.UNDER_17, TutorialTypes.ONBOARDING)

        const subtitle =
          'Tu peux bénéficier de ton crédit sur l’application à partir de tes 17 ans.'

        expect(screen.getByText(subtitle)).toBeOnTheScreen()
      })
    })
  })
})

const renderNonEligibleModal = (userStatus: NonEligible, type: TutorialTypes) => {
  return render(
    <NonEligibleModal visible hideModal={hideModal} userStatus={userStatus} type={type} />
  )
}
