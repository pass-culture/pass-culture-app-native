import React from 'react'

import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { NonEligible, Tutorial } from 'features/tutorial/enums'
import { NonEligibleModal } from 'features/tutorial/pages/NonEligibleModal'
import { env } from 'libs/environment/__mocks__/envFixtures'
import { fireEvent, render } from 'tests/utils'

const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')
const hideModal = jest.fn()

describe('NonEligibleModal', () => {
  it('should render correctly for onboarding non-eligible under 15', () => {
    const renderAPI = renderNonEligibleModal(NonEligible.UNDER_15, Tutorial.ONBOARDING)

    expect(renderAPI).toMatchSnapshot()
  })

  it('should render correctly for profile tutorial non-eligible under 15 ', () => {
    const renderAPI = renderNonEligibleModal(NonEligible.UNDER_15, Tutorial.PROFILE_TUTORIAL)

    expect(renderAPI).toMatchSnapshot()
  })

  it('should render correctly for onboarding non-eligible over 18 ', () => {
    const renderAPI = renderNonEligibleModal(NonEligible.OVER_18, Tutorial.ONBOARDING)

    expect(renderAPI).toMatchSnapshot()
  })

  it('should render correctly for profile tutorial non-eligible over 18 ', () => {
    const renderAPI = renderNonEligibleModal(NonEligible.OVER_18, Tutorial.PROFILE_TUTORIAL)

    expect(renderAPI).toMatchSnapshot()
  })

  it.each(Object.values(NonEligible))(
    'should close modal when pressing right header icon',
    (userStatus) => {
      const { getByTestId } = renderNonEligibleModal(userStatus, Tutorial.ONBOARDING)

      fireEvent.press(getByTestId('Fermer la modale'))
      expect(hideModal).toHaveBeenCalledTimes(1)
    }
  )

  it.each(Object.values(NonEligible))(
    'should close modal when pressing "j’ai compris"',
    (userStatus) => {
      const { getByText } = renderNonEligibleModal(userStatus, Tutorial.ONBOARDING)

      const button = getByText('Explorer l’application')
      fireEvent.press(button)

      expect(hideModal).toHaveBeenCalledTimes(1)
    }
  )

  it('should redirect to FAQ when pressing "comment ça marche ?" for underage non-eligible', () => {
    const { getByText } = renderNonEligibleModal(NonEligible.UNDER_15, Tutorial.ONBOARDING)
    const button = getByText('comment ça marche\u00a0?')

    fireEvent.press(button)
    expect(openUrl).toHaveBeenCalledWith(env.FAQ_LINK_CREDIT)
  })
})

const renderNonEligibleModal = (userStatus: NonEligible, type: Tutorial) => {
  return render(
    <NonEligibleModal visible hideModal={hideModal} userStatus={userStatus} type={type} />
  )
}
