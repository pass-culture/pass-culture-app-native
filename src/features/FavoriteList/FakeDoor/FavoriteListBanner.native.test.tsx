import React from 'react'

import { FavoriteListBanner } from 'features/FavoriteList/FakeDoor/FavoriteListBanner'
import { fireEvent, render, screen } from 'tests/utils'

describe('FavoriteListBanner', () => {
  it('should open modal when clicking the banner', () => {
    render(<FavoriteListBanner />)

    const banner = screen.getByText('Crée une liste de favoris')
    fireEvent.press(banner)
    expect(screen.getByText('Encore un peu de patience...')).toBeTruthy()
  })
})
