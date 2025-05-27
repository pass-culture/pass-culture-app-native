import React from 'react'

import { OfferArtists } from 'features/offer/components/OfferArtists/OfferArtists'
import { fireEvent, render, screen } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

describe('<OfferArtists />', () => {
  it('should display artists', () => {
    render(<OfferArtists artists="Edith Piaf" />)

    expect(screen.getByText('Edith Piaf')).toBeOnTheScreen()
  })

  it('should display clickable artist button when onPressArtistLink callback is defined', async () => {
    const handlePressLink = jest.fn()
    render(<OfferArtists artists="Edith Piaf" onPressArtistLink={handlePressLink} />)

    // userEvent.press not working correctly here
    // eslint-disable-next-line local-rules/no-fireEvent
    fireEvent.press(screen.getByText('Edith Piaf'))

    expect(handlePressLink).toHaveBeenCalledWith()
  })

  it('should not display clickable artist button when onPressArtistLink callback is not defined', () => {
    render(<OfferArtists artists="Edith Piaf" />)

    expect(
      screen.queryByRole('button', { name: 'Accéder à la page de Edith Piaf' })
    ).not.toBeOnTheScreen()
  })
})
