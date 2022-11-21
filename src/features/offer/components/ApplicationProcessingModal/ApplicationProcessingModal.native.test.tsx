import React from 'react'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import { analytics } from 'libs/firebase/analytics'
import { fireEvent, render } from 'tests/utils'

import { ApplicationProcessingModal } from './ApplicationProcessingModal'

const hideModal = jest.fn()
const offerId = 1
jest.mock('features/offer/components/AddToFavoritesButton/AddToFavoritesButton')

describe('<ApplicationProcessingModal />', () => {
  it('should match previous snapshot', () => {
    const modal = render(
      <ApplicationProcessingModal visible hideModal={hideModal} offerId={offerId} />
    )
    expect(modal).toMatchSnapshot()
  })

  it('should navigate to profile when clicking on button "Aller sur mon profil"', async () => {
    const { getByTestId } = render(
      <ApplicationProcessingModal visible hideModal={hideModal} offerId={offerId} />
    )
    const button = getByTestId('Aller sur mon profil')

    fireEvent.press(button)

    await waitForExpect(() => {
      expect(navigate).toHaveBeenCalledWith('TabNavigator', { screen: 'Profile' })
    })
  })

  it('should log analytics when clicking on button "Aller sur mon profil', async () => {
    const { getByLabelText } = render(
      <ApplicationProcessingModal visible hideModal={hideModal} offerId={offerId} />
    )

    fireEvent.press(getByLabelText('Aller sur mon profil'))

    expect(analytics.logGoToProfil).toHaveBeenCalledWith({
      from: 'ApplicationProccessingModal',
      offerId,
    })
  })
})
