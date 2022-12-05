import React from 'react'

import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { NonEligibleModal } from 'features/onboarding/pages/NonEligibleModal'
import { NonEligible } from 'features/onboarding/types'
import { env } from 'libs/environment/__mocks__/envFixtures'
import { fireEvent, render } from 'tests/utils'

const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')
const hideModal = jest.fn()

describe('NonEligibleModal', () => {
  it.each(Object.values(NonEligible))(
    'should render correctly for non-eligible %s',
    (modalType) => {
      const renderAPI = renderNonEligibleModal(modalType)
      expect(renderAPI).toMatchSnapshot()
    }
  )

  it.each(Object.values(NonEligible))(
    'should close modal when pressing right header icon',
    (modalType) => {
      const { getByTestId } = renderNonEligibleModal(modalType)

      fireEvent.press(getByTestId('Fermer la modale'))
      expect(hideModal).toHaveBeenCalledTimes(1)
    }
  )

  it.each(Object.values(NonEligible))(
    'should close modal when pressing "j’ai compris"',
    (modalType) => {
      const { getByText } = renderNonEligibleModal(modalType)

      const button = getByText('Explorer l’application')
      fireEvent.press(button)

      expect(hideModal).toHaveBeenCalledTimes(1)
    }
  )

  it('should redirect to FAQ when pressing "comment ça marche ?" for underage non-eligible', () => {
    const { getByText } = renderNonEligibleModal(NonEligible.UNDER_15)
    const button = getByText('comment ça marche\u00a0?')

    fireEvent.press(button)
    expect(openUrl).toHaveBeenCalledWith(env.FAQ_LINK_CREDIT)
  })
})

const renderNonEligibleModal = (modalType: NonEligible) => {
  return render(<NonEligibleModal visible hideModal={hideModal} modalType={modalType} />)
}
