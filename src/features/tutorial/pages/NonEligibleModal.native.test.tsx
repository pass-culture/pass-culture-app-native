import React from 'react'

import { navigateToHome } from 'features/navigation/helpers'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { NonEligible, TutorialTypes } from 'features/tutorial/enums'
import { NonEligibleModal } from 'features/tutorial/pages/NonEligibleModal'
import { env } from 'libs/environment/__mocks__/envFixtures'
import { fireEvent, render, screen } from 'tests/utils'

jest.mock('features/navigation/helpers/navigateToHome')
const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')
const hideModal = jest.fn()

describe('NonEligibleModal', () => {
  it('should render correctly for onboarding non-eligible under 15', () => {
    const renderAPI = renderNonEligibleModal(NonEligible.UNDER_15, TutorialTypes.ONBOARDING)

    expect(renderAPI).toMatchSnapshot()
  })

  it('should render correctly for profile tutorial non-eligible under 15 ', () => {
    const renderAPI = renderNonEligibleModal(NonEligible.UNDER_15, TutorialTypes.PROFILE_TUTORIAL)

    expect(renderAPI).toMatchSnapshot()
  })

  it('should render correctly for onboarding non-eligible over 18 ', () => {
    const renderAPI = renderNonEligibleModal(NonEligible.OVER_18, TutorialTypes.ONBOARDING)

    expect(renderAPI).toMatchSnapshot()
  })

  it('should render correctly for profile tutorial non-eligible over 18 ', () => {
    const renderAPI = renderNonEligibleModal(NonEligible.OVER_18, TutorialTypes.PROFILE_TUTORIAL)

    expect(renderAPI).toMatchSnapshot()
  })

  it.each(Object.values(NonEligible))(
    'should close modal when pressing right header icon',
    (userStatus) => {
      renderNonEligibleModal(userStatus, TutorialTypes.ONBOARDING)

      fireEvent.press(screen.getByTestId('Fermer la modale'))
      expect(hideModal).toHaveBeenCalledTimes(1)
    }
  )

  it.each(Object.values(NonEligible))(
    'should close modal when pressing "Explorer le catalogue"',
    (userStatus) => {
      renderNonEligibleModal(userStatus, TutorialTypes.ONBOARDING)

      const button = screen.getByText('Explorer le catalogue')
      fireEvent.press(button)

      expect(hideModal).toHaveBeenCalledTimes(1)
    }
  )

  it.each(Object.values(NonEligible))(
    'should navigate to home when pressing "Explorer le catalogue" on profile tutorial',
    (userStatus) => {
      renderNonEligibleModal(userStatus, TutorialTypes.PROFILE_TUTORIAL)

      const button = screen.getByText('Explorer le catalogue')
      fireEvent.press(button)

      expect(navigateToHome).toHaveBeenCalledTimes(1)
    }
  )

  it.each(Object.values(NonEligible))(
    'should not navigate to home when pressing "Explorer le catalogue" on onboarding',
    (userStatus) => {
      renderNonEligibleModal(userStatus, TutorialTypes.ONBOARDING)

      const button = screen.getByText('Explorer le catalogue')
      fireEvent.press(button)

      expect(navigateToHome).not.toHaveBeenCalled()
    }
  )

  it('should redirect to FAQ when pressing "comment ça marche ?" for underage non-eligible', () => {
    renderNonEligibleModal(NonEligible.UNDER_15, TutorialTypes.ONBOARDING)
    const button = screen.getByText('comment ça marche\u00a0?')

    fireEvent.press(button)
    expect(openUrl).toHaveBeenCalledWith(env.FAQ_LINK_CREDIT)
  })
})

const renderNonEligibleModal = (userStatus: NonEligible, type: TutorialTypes) => {
  return render(
    <NonEligibleModal visible hideModal={hideModal} userStatus={userStatus} type={type} />
  )
}
