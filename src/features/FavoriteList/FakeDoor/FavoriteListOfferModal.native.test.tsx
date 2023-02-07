import React from 'react'

import { FavoriteListOfferModal } from 'features/FavoriteList/FakeDoor/FavoriteListOfferModal'
import { fireEvent, render, screen } from 'tests/utils'

describe('<FavoriteListOfferModal />', () => {
  it('should render correctly', () => {
    render(<FavoriteListOfferModal visible hideModal={jest.fn()} />)
    expect(screen).toMatchSnapshot()
  })

  it('should hide modal on click on "non merci"', () => {
    const hideModalMock = jest.fn()
    render(<FavoriteListOfferModal visible hideModal={hideModalMock} />)

    fireEvent.press(screen.getByText('Non merci'))

    expect(hideModalMock).toHaveBeenCalledTimes(1)
  })

  it('should open survey modal on click on "Créer une liste de favoris"', () => {
    render(<FavoriteListOfferModal visible hideModal={jest.fn()} />)

    fireEvent.press(screen.getByText('Créer une liste de favoris'))

    expect(screen.getByText('Encore un peu de patience...')).toBeTruthy()
  })

  it('should close both modals when closing survey modal', () => {
    const hideModalMock = jest.fn()
    render(<FavoriteListOfferModal visible hideModal={hideModalMock} />)

    fireEvent.press(screen.getByText('Créer une liste de favoris'))

    fireEvent.press(screen.getAllByLabelText('Fermer la modale')[2])

    expect(hideModalMock).toHaveBeenCalledTimes(1)
  })
})
