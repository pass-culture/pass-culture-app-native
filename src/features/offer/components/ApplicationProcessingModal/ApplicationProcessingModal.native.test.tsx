import React from 'react'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import { analytics } from 'libs/firebase/analytics'
import { fireEvent, render } from 'tests/utils'

import { ApplicationProcessingModal } from './ApplicationProcessingModal'

jest.mock('react-query')

const hideModal = jest.fn()
const offerId = 1

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
    const { getByTestId } = render(
      <ApplicationProcessingModal visible hideModal={hideModal} offerId={offerId} />
    )

    fireEvent.press(getByTestId('Aller sur mon profil'))

    expect(analytics.logGoToProfil).toHaveBeenCalledWith({
      from: 'ApplicationProcessingModal',
      offerId,
    })
  })

  it('should close modal when clicking on button "Mettre en favori', async () => {
    const { getByText } = render(
      <ApplicationProcessingModal visible hideModal={hideModal} offerId={offerId} />
    )

    fireEvent.press(getByText('Mettre en favori'))

    expect(hideModal).toHaveBeenCalledTimes(1)
  })

  it('should log analytics when clicking on button "Mettre en favori', async () => {
    const { getByText } = render(
      <ApplicationProcessingModal visible hideModal={hideModal} offerId={offerId} />
    )

    fireEvent.press(getByText('Mettre en favori'))

    expect(analytics.logHasAddedOfferToFavorites).toHaveBeenCalledWith({
      from: 'ApplicationProcessingModal',
      offerId,
    })
  })
})
