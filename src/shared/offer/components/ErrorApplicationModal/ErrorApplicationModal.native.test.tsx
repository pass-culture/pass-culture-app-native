import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { analytics } from 'libs/analytics'
import { ErrorApplicationModal } from 'shared/offer/components/ErrorApplicationModal/ErrorApplicationModal'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, fireEvent, screen, waitFor } from 'tests/utils'

const hideModal = jest.fn()
const offerId = 1

describe('<ErrorApplicationModal />', () => {
  it('should match previous snapshot', () => {
    render(
      reactQueryProviderHOC(
        <ErrorApplicationModal visible hideModal={hideModal} offerId={offerId} />
      )
    )

    expect(screen).toMatchSnapshot()
  })

  it('should close modal and navigate to profile when pressing "Aller vers la section profil" button', () => {
    render(
      reactQueryProviderHOC(
        <ErrorApplicationModal visible hideModal={hideModal} offerId={offerId} />
      )
    )

    fireEvent.press(screen.getByLabelText('Aller vers la section profil'))

    expect(hideModal).toHaveBeenCalledTimes(1)
    expect(navigate).toHaveBeenCalledWith('TabNavigator', { screen: 'Profile' })
  })

  it('should log analytics when clicking on close button with label "Aller vers la section profil', async () => {
    render(
      reactQueryProviderHOC(
        <ErrorApplicationModal visible hideModal={hideModal} offerId={offerId} />
      )
    )

    fireEvent.press(screen.getByLabelText('Aller vers la section profil'))

    expect(analytics.logGoToProfil).toHaveBeenNthCalledWith(1, {
      from: 'ErrorApplicationModal',
      offerId,
    })
  })

  it('should close modal when clicking on button "Mettre en favori', async () => {
    render(
      reactQueryProviderHOC(
        <ErrorApplicationModal visible hideModal={hideModal} offerId={offerId} />
      )
    )

    fireEvent.press(screen.getByText('Mettre en favori'))

    await waitFor(() => {
      expect(hideModal).toHaveBeenCalledTimes(1)
    })
  })

  it('should log analytics when clicking on button "Mettre en favori', async () => {
    render(
      reactQueryProviderHOC(
        <ErrorApplicationModal visible hideModal={hideModal} offerId={offerId} />
      )
    )

    fireEvent.press(screen.getByText('Mettre en favori'))

    await waitFor(() => {
      expect(analytics.logHasAddedOfferToFavorites).toHaveBeenCalledWith({
        from: 'ErrorApplicationModal',
        offerId,
      })
    })
  })
})
