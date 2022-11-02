import React from 'react'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import { fireEvent, render } from 'tests/utils'

import { ApplicationProcessingModal } from './ApplicationProcessingModal'

const hideModal = jest.fn()
const offerId = 1

describe('<ApplicationProcessingModal />', () => {
  it('should match previous snapshot', () => {
    const modal = render(
      <ApplicationProcessingModal visible hideModal={hideModal} offerId={offerId} />
    )
    expect(modal).toMatchSnapshot()
  })

  it('should navigate to profile on click on Aller sur mon profil', async () => {
    const { getByLabelText } = render(
      <ApplicationProcessingModal visible hideModal={hideModal} offerId={offerId} />
    )
    const button = getByLabelText('Aller sur mon profil')

    fireEvent.press(button)

    await waitForExpect(() => {
      expect(navigate).toHaveBeenCalledWith('TabNavigator', { screen: 'Profile' })
    })
  })
})
