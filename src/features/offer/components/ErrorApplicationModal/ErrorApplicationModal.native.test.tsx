import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { ErrorApplicationModal } from 'features/offer/components/ErrorApplicationModal/ErrorApplicationModal'
import { analytics } from 'libs/firebase/analytics'
import { render, fireEvent } from 'tests/utils'

jest.mock('react-query')

const hideModal = jest.fn()
const offerId = 1

describe('<ErrorApplicationModal />', () => {
  it('should match previous snapshot', () => {
    const modal = render(<ErrorApplicationModal visible hideModal={hideModal} offerId={offerId} />)

    expect(modal).toMatchSnapshot()
  })

  it('should close modal and navigate to profile when pressing "Aller vers la section profil" button', () => {
    const { getByLabelText } = render(
      <ErrorApplicationModal visible hideModal={hideModal} offerId={offerId} />
    )

    fireEvent.press(getByLabelText('Aller vers la section profil'))

    expect(hideModal).toBeCalledTimes(1)
    expect(navigate).toBeCalledWith('TabNavigator', { screen: 'Profile' })
  })

  it('should log analytics when clicking on close button with label "Aller vers la section profil', async () => {
    const { getByLabelText } = render(
      <ErrorApplicationModal visible hideModal={hideModal} offerId={offerId} />
    )

    fireEvent.press(getByLabelText('Aller vers la section profil'))

    expect(analytics.logGoToProfil).toHaveBeenNthCalledWith(1, {
      from: 'ErrorApplicationModal',
      offerId,
    })
  })

  it('should close modal when clicking on button "Mettre en favori', async () => {
    const { getByText } = render(
      <ErrorApplicationModal visible hideModal={hideModal} offerId={offerId} />
    )

    fireEvent.press(getByText('Mettre en favori'))

    expect(hideModal).toHaveBeenCalledTimes(1)
  })

  it('should log analytics when clicking on button "Mettre en favori', async () => {
    const { getByText } = render(
      <ErrorApplicationModal visible hideModal={hideModal} offerId={offerId} />
    )

    fireEvent.press(getByText('Mettre en favori'))

    expect(analytics.logHasAddedOfferToFavorites).toHaveBeenCalledWith({
      from: 'ErrorApplicationModal',
      offerId,
    })
  })
})
