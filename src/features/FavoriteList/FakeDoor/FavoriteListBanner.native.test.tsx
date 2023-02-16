import React from 'react'

import { FavoriteListBanner } from 'features/FavoriteList/FakeDoor/FavoriteListBanner'
import { analytics } from 'libs/firebase/analytics'
import { fireEvent, render, screen } from 'tests/utils'

describe('FavoriteListBanner', () => {
  it('should open modal when clicking the banner', () => {
    render(<FavoriteListBanner />)

    const banner = screen.getByText('Crée une liste de favoris')
    fireEvent.press(banner)
    expect(screen.getByText('Encore un peu de patience...')).toBeTruthy()
  })

  it('should log when the user sees favorite list banner', () => {
    render(<FavoriteListBanner />)

    expect(analytics.logFavoriteListDisplayed).toHaveBeenNthCalledWith(1, 'favorites')
  })

  it('should log when the user presses favorite list banner', () => {
    render(<FavoriteListBanner />)

    const banner = screen.getByText('Crée une liste de favoris')
    fireEvent.press(banner)

    expect(analytics.logFavoriteListButtonClicked).toHaveBeenNthCalledWith(1, 'favorites')
  })
})
