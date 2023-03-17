import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { analytics } from 'libs/firebase/analytics'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

import { ApplicationProcessingModal } from './ApplicationProcessingModal'

jest.mock('react-query')

const hideModal = jest.fn()
const offerId = 1

describe('<ApplicationProcessingModal />', () => {
  it('should match previous snapshot', () => {
    render(<ApplicationProcessingModal visible hideModal={hideModal} offerId={offerId} />)

    expect(screen).toMatchSnapshot()
  })

  it('should navigate to profile when clicking on button "Aller sur mon profil"', async () => {
    render(<ApplicationProcessingModal visible hideModal={hideModal} offerId={offerId} />)

    const button = screen.getByTestId('Aller sur mon profil')
    fireEvent.press(button)

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('TabNavigator', { screen: 'Profile' })
    })
  })

  it('should log analytics when clicking on button "Aller sur mon profil', () => {
    render(<ApplicationProcessingModal visible hideModal={hideModal} offerId={offerId} />)

    fireEvent.press(screen.getByTestId('Aller sur mon profil'))

    expect(analytics.logGoToProfil).toHaveBeenCalledWith({
      from: 'ApplicationProcessingModal',
      offerId,
    })
  })

  it('should close modal when clicking on button "Mettre en favori', () => {
    render(<ApplicationProcessingModal visible hideModal={hideModal} offerId={offerId} />)

    fireEvent.press(screen.getByText('Mettre en favori'))

    expect(hideModal).toHaveBeenCalledTimes(1)
  })

  it('should log analytics when clicking on button "Mettre en favori', () => {
    render(<ApplicationProcessingModal visible hideModal={hideModal} offerId={offerId} />)

    fireEvent.press(screen.getByText('Mettre en favori'))

    expect(analytics.logHasAddedOfferToFavorites).toHaveBeenCalledWith({
      from: 'ApplicationProcessingModal',
      offerId,
    })
  })
})
