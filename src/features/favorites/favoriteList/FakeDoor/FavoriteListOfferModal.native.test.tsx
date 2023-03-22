import React from 'react'

import { FavoriteListOfferModal } from 'features/favorites/favoriteList/FakeDoor/FavoriteListOfferModal'
import { analytics } from 'libs/firebase/analytics'
import { fireEvent, render, screen } from 'tests/utils'

describe('<FavoriteListOfferModal />', () => {
  it('should render correctly', () => {
    render(<FavoriteListOfferModal visible hideModal={jest.fn()} showSurveyModal={jest.fn()} />)
    expect(screen).toMatchSnapshot()
  })

  it('should hide modal when "Non merci" button is pressed', () => {
    const hideModalMock = jest.fn()
    render(<FavoriteListOfferModal visible hideModal={hideModalMock} showSurveyModal={jest.fn()} />)

    fireEvent.press(screen.getByText('Non merci'))

    expect(hideModalMock).toHaveBeenCalledTimes(1)
  })

  it('should close when "Créer une liste de favoris" button is pressed', () => {
    const hideModalMock = jest.fn()
    render(<FavoriteListOfferModal visible hideModal={hideModalMock} showSurveyModal={jest.fn()} />)

    fireEvent.press(screen.getByText('Créer une liste de favoris'))

    expect(hideModalMock).toHaveBeenCalledTimes(1)
  })

  it('should track when the user wants to create a favorite list', () => {
    render(<FavoriteListOfferModal visible hideModal={jest.fn()} showSurveyModal={jest.fn()} />)

    fireEvent.press(screen.getByText('Créer une liste de favoris'))

    expect(analytics.logFavoriteListButtonClicked).toHaveBeenNthCalledWith(1, 'offer')
  })
})
