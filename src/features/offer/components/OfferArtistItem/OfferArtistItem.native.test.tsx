import React from 'react'

import { mockArtist, mockArtistWithoutId } from 'features/artist/fixtures/mockArtist'
import { OfferArtistItem } from 'features/offer/components/OfferArtistItem/OfferArtistItem'
import { render, screen } from 'tests/utils'

describe('OfferArtistItem', () => {
  describe('when artist has ID (has dedicated page)', () => {
    it('should display correctly with accessibility label', () => {
      render(
        <OfferArtistItem
          artist={mockArtist}
          navigateTo={{ screen: 'Artist', params: { id: mockArtist.id } }}
          onBeforeNavigate={jest.fn()}
        />
      )

      expect(screen.getByLabelText(`${mockArtist.name}, accéder à la page`)).toBeOnTheScreen()
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

    it('should display chevron icon', () => {
      render(
        <OfferArtistItem
          artist={mockArtist}
          navigateTo={{ screen: 'Artist', params: { id: mockArtist.id } }}
          onBeforeNavigate={jest.fn()}
        />
      )

      expect(screen.getByTestId('chevronIcon')).toBeOnTheScreen()
    })
  })

  describe('when artist has no ID (no dedicated page)', () => {
    it('should display correctly with accessibility label indicating page unavailable', () => {
      render(<OfferArtistItem artist={mockArtistWithoutId} />)

      expect(
        screen.getByLabelText(`${mockArtistWithoutId.name}, page non disponible`)
      ).toBeOnTheScreen()
    })

    it('should NOT display chevron icon', () => {
      render(<OfferArtistItem artist={mockArtistWithoutId} />)

      expect(screen.queryByTestId('chevronIcon')).not.toBeOnTheScreen()
    })

    it('should always display default avatar even if image is provided', () => {
      render(<OfferArtistItem artist={mockArtistWithoutId} />)

      expect(screen.getByTestId('defaultAvatar')).toBeOnTheScreen()
      expect(screen.queryByLabelText('artist avatar')).not.toBeOnTheScreen()
    })

    it('should display artist name', () => {
      render(<OfferArtistItem artist={mockArtistWithoutId} />)

      expect(screen.getByText(mockArtistWithoutId.name)).toBeOnTheScreen()
    })
  })
})
