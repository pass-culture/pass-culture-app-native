import React from 'react'

import { CategoryIdEnum, SubcategoryIdEnum } from 'api/gen'
import { OfferArtistsSection } from 'features/offer/components/OfferArtistsSection/OfferArtistsSection'
import { render, screen } from 'tests/utils'

const mockArtist = { id: '1', name: 'Edith Piaf' }
const mockMultiArtists = [
  { id: '1', name: 'Sam Worthington' },
  { id: '2', name: 'Zoe Saldana' },
  { id: '3', name: 'Sigourney Weaver' },
]

describe('<OfferArtistsSection />', () => {
  it('should display single artist', () => {
    render(
      <OfferArtistsSection
        artists={[mockArtist]}
        offerCategoryId={CategoryIdEnum.MUSIQUE_ENREGISTREE}
        offerSubcategoryId={SubcategoryIdEnum.SUPPORT_PHYSIQUE_MUSIQUE_VINYLE}
        onPlaylistItemPress={jest.fn()}
      />
    )

    expect(screen.getByText('Edith Piaf')).toBeOnTheScreen()
  })

  it('should display singular section title when single artist', () => {
    render(
      <OfferArtistsSection
        artists={[mockArtist]}
        offerCategoryId={CategoryIdEnum.MUSIQUE_ENREGISTREE}
        offerSubcategoryId={SubcategoryIdEnum.SUPPORT_PHYSIQUE_MUSIQUE_VINYLE}
        onPlaylistItemPress={jest.fn()}
      />
    )

    expect(screen.getAllByText('Artiste')[0]).toBeOnTheScreen()
  })

  it('should display multi artists', () => {
    render(
      <OfferArtistsSection
        artists={mockMultiArtists}
        offerCategoryId={CategoryIdEnum.MUSIQUE_ENREGISTREE}
        offerSubcategoryId={SubcategoryIdEnum.SUPPORT_PHYSIQUE_MUSIQUE_VINYLE}
        onPlaylistItemPress={jest.fn()}
      />
    )

    expect(screen.getByText('Sam Worthington')).toBeOnTheScreen()
    expect(screen.getByText('Zoe Saldana')).toBeOnTheScreen()
    expect(screen.getByText('Sigourney Weaver')).toBeOnTheScreen()
  })

  it('should display plural section title when multi artists', () => {
    render(
      <OfferArtistsSection
        artists={mockMultiArtists}
        offerCategoryId={CategoryIdEnum.MUSIQUE_ENREGISTREE}
        offerSubcategoryId={SubcategoryIdEnum.SUPPORT_PHYSIQUE_MUSIQUE_VINYLE}
        onPlaylistItemPress={jest.fn()}
      />
    )

    expect(screen.getByText('Artistes')).toBeOnTheScreen()
  })
})
