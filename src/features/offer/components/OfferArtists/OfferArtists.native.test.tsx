import React from 'react'

import { OfferArtists } from 'features/offer/components/OfferArtists/OfferArtists'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

const user = userEvent.setup()

jest.useFakeTimers()

const mockArtist = { id: '1', name: 'Edith Piaf' }
const mockMultiArtists = [
  { id: '1', name: 'Sam Worthington' },
  { id: '2', name: 'Zoe Saldana' },
  { id: '3', name: 'Sigourney Weaver' },
]

describe('<OfferArtists />', () => {
  it('should display artists', () => {
    render(<OfferArtists artists={[mockArtist]} />)

    expect(screen.getByText('Edith Piaf')).toBeOnTheScreen()
  })

  it('should use wording with "et X autre" when isMultiArtistsEnabled FF activated and artists names are more than 2', () => {
    render(<OfferArtists artists={mockMultiArtists} isMultiArtistsEnabled />)

    expect(screen.getByText('Sam Worthington, Zoe Saldana et 1 autre')).toBeOnTheScreen()
  })

  it('should not use wording with "et X autre" when isMultiArtistsEnabled FF deactivated and artists names are more than 2', () => {
    render(<OfferArtists artists={mockMultiArtists} isMultiArtistsEnabled={false} />)

    expect(screen.getByText('Sam Worthington, Zoe Saldana, Sigourney Weaver')).toBeOnTheScreen()
  })

  it('should display right icon when onPressArtistLink callback is defined', () => {
    const handlePressLink = jest.fn()
    render(<OfferArtists artists={[mockArtist]} onPressArtistLink={handlePressLink} />)

    expect(screen.getByTestId('right-icon')).toBeOnTheScreen()
  })

  it('should not display right icon when onPressArtistLink callback not defined', () => {
    render(<OfferArtists artists={[mockArtist]} />)

    expect(screen.queryByTestId('right-icon')).not.toBeOnTheScreen()
  })

  it('should display clickable artist button when onPressArtistLink callback is defined', async () => {
    const handlePressLink = jest.fn()
    render(<OfferArtists artists={[mockArtist]} onPressArtistLink={handlePressLink} />)

    await user.press(screen.getByLabelText('Accéder à la page de Edith Piaf'))

    expect(handlePressLink).toHaveBeenCalledTimes(1)
  })

  it('should not display clickable artist button when onPressArtistLink callback is not defined', () => {
    render(<OfferArtists artists={[mockArtist]} />)

    expect(
      screen.queryByRole('button', { name: 'Accéder à la page de Edith Piaf' })
    ).not.toBeOnTheScreen()
  })

  it('should use an accessibility label specifying that a list of artists is being opened when there are several artists', () => {
    render(<OfferArtists artists={mockMultiArtists} onPressArtistLink={jest.fn()} />)

    expect(screen.getByLabelText('Ouvrir la liste des artistes')).toBeOnTheScreen()
  })
})
