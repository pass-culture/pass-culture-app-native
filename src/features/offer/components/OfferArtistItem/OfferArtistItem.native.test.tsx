import React from 'react'

import { mockArtist } from 'features/artist/fixtures/mockArtist'
import { OfferArtistItem } from 'features/offer/components/OfferArtistItem/OfferArtistItem'
import { render, screen } from 'tests/utils'

describe('OfferArtistItem', () => {
  it('should display correctly', () => {
    render(
      <OfferArtistItem
        artist={mockArtist}
        navigateTo={{ screen: 'Artist', params: { id: mockArtist.id } }}
        onBeforeNavigate={jest.fn()}
      />
    )

    expect(screen.getByLabelText(`Voir l’artiste ${mockArtist.name}`)).toBeOnTheScreen()
  })

  it('should display artist image when defined', () => {
    render(
      <OfferArtistItem
        artist={mockArtist}
        navigateTo={{ screen: 'Artist', params: { id: mockArtist.id } }}
        onBeforeNavigate={jest.fn()}
      />
    )

    expect(screen.getByLabelText('artist avatar')).toBeOnTheScreen()
  })

  it('should display default avatar when artist image not defined', () => {
    render(
      <OfferArtistItem
        artist={{ ...mockArtist, image: undefined }}
        navigateTo={{ screen: 'Artist', params: { id: mockArtist.id } }}
        onBeforeNavigate={jest.fn()}
      />
    )

    expect(screen.getByTestId('defaultAvatar')).toBeOnTheScreen()
  })
})
