import React from 'react'

import { navigateToHome } from 'features/navigation/helpers/navigateToHome'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { NonEligible, TutorialTypes } from 'features/tutorial/enums'
import { NotEligibleModal } from 'features/tutorial/pages/NotEligibleModal'
import { env } from 'libs/environment/fixtures'
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

describe('NotEligibleModal', () => {
  it('should display subtitle with credit V2', () => {
    renderNotEligibleModal(NonEligible.UNDER_15, TutorialTypes.ONBOARDING)

    const subtitle = 'Tu peux bénéficier de ton crédit sur l’application à partir de tes 15 ans.'

    expect(screen.getByText(subtitle)).toBeOnTheScreen()
  })

  describe('for user over 18 years old', () => {
    it('should return null', () => {
      renderNotEligibleModal(NonEligible.OVER_18, TutorialTypes.ONBOARDING)

      expect(screen.toJSON()).toBeNull()
    })
  })

  describe('for user under 15 years old', () => {
    it('should render correctly for onboarding', () => {
      renderNotEligibleModal(NonEligible.UNDER_15, TutorialTypes.ONBOARDING)

      expect(screen).toMatchSnapshot()
    })

    it('should render correctly for profile tutorial', () => {
      renderNotEligibleModal(NonEligible.UNDER_15, TutorialTypes.PROFILE_TUTORIAL)

      expect(screen).toMatchSnapshot()
    })

    it('should close modal when pressing right header icon', async () => {
      renderNotEligibleModal(NonEligible.UNDER_15, TutorialTypes.ONBOARDING)

      const button = screen.getByTestId('Fermer la modale')
      await user.press(button)

      expect(hideModal).toHaveBeenCalledTimes(1)
    })

    it('should close modal when pressing "Explorer le catalogue" on onboarding', async () => {
      renderNotEligibleModal(NonEligible.UNDER_15, TutorialTypes.ONBOARDING)

      const button = screen.getByText('Explorer le catalogue')
      await user.press(button)

      expect(hideModal).toHaveBeenCalledTimes(1)
    })

    it('should navigate to home when pressing "Explorer le catalogue" on profile tutorial', async () => {
      renderNotEligibleModal(NonEligible.UNDER_15, TutorialTypes.PROFILE_TUTORIAL)

      const button = screen.getByText('Explorer le catalogue')
      await user.press(button)

      expect(navigateToHome).toHaveBeenCalledTimes(1)
    })

    it('should not navigate to home when pressing "Explorer le catalogue" on onboarding', async () => {
      renderNotEligibleModal(NonEligible.UNDER_15, TutorialTypes.ONBOARDING)

      const button = screen.getByText('Explorer le catalogue')
      await user.press(button)

      expect(navigateToHome).not.toHaveBeenCalled()
    })

    it('should redirect to FAQ when pressing "comment ça marche ?" on onboarding', async () => {
      renderNotEligibleModal(NonEligible.UNDER_15, TutorialTypes.ONBOARDING)

      const button = screen.getByText('comment ça marche\u00a0?')
      await user.press(button)

      expect(openUrl).toHaveBeenCalledWith(env.FAQ_LINK_CREDIT)
    })
  })
})

const renderNotEligibleModal = (userStatus: NonEligible, type: TutorialTypes) => {
  return render(
    <NotEligibleModal visible hideModal={hideModal} userStatus={userStatus} type={type} />
  )
}
