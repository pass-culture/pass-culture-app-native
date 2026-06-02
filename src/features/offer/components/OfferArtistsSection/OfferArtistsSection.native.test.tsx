import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { ArtistType, CategoryIdEnum, SubcategoryIdEnum } from 'api/gen'
import { OfferArtistsSection } from 'features/offer/components/OfferArtistsSection/OfferArtistsSection'
import { render, screen, userEvent } from 'tests/utils'

const mockArtist = { id: '1', name: 'Edith Piaf' }
const mockMultiArtists = [
  { id: '1', name: 'Sam Worthington' },
  { id: '2', name: 'Zoe Saldana' },
  { id: '3', name: 'Sigourney Weaver' },
]

const user = userEvent.setup()

jest.useFakeTimers()

describe('<OfferArtistsSection />', () => {
  describe('When single artist', () => {
    it('should display correctly', () => {
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

    it('should display default avatar when image not defined', () => {
      render(
        <OfferArtistsSection
          artists={[mockArtist]}
          offerCategoryId={CategoryIdEnum.MUSIQUE_ENREGISTREE}
          offerSubcategoryId={SubcategoryIdEnum.SUPPORT_PHYSIQUE_MUSIQUE_VINYLE}
          onPlaylistItemPress={jest.fn()}
        />
      )

      expect(screen.getByTestId('defaultArtistAvatar')).toBeOnTheScreen()
    })

    it('should display artist image when image defined', () => {
      render(
        <OfferArtistsSection
          artists={[{ ...mockArtist, image: 'url' }]}
          offerCategoryId={CategoryIdEnum.MUSIQUE_ENREGISTREE}
          offerSubcategoryId={SubcategoryIdEnum.SUPPORT_PHYSIQUE_MUSIQUE_VINYLE}
          onPlaylistItemPress={jest.fn()}
        />
      )

      expect(screen.getByTestId('ArtistImage')).toBeOnTheScreen()
    })

    it('should display role as subtitle when role defined', () => {
      render(
        <OfferArtistsSection
          artists={[{ ...mockArtist, role: ArtistType.author }]}
          offerCategoryId={CategoryIdEnum.MUSIQUE_ENREGISTREE}
          offerSubcategoryId={SubcategoryIdEnum.SUPPORT_PHYSIQUE_MUSIQUE_VINYLE}
          onPlaylistItemPress={jest.fn()}
        />
      )

      expect(screen.getByText('Auteur')).toBeOnTheScreen()
      expect(screen.getByTestId('subtitleWithTitle')).toBeOnTheScreen()
    })

    it('should redirect to artist page when pressing button', async () => {
      render(
        <OfferArtistsSection
          artists={[mockArtist]}
          offerCategoryId={CategoryIdEnum.MUSIQUE_ENREGISTREE}
          offerSubcategoryId={SubcategoryIdEnum.SUPPORT_PHYSIQUE_MUSIQUE_VINYLE}
          onPlaylistItemPress={jest.fn()}
        />
      )

      await user.press(screen.getByLabelText('Accéder à la page artiste de Edith Piaf'))

      expect(navigate).toHaveBeenCalledWith('Artist', { id: '1' })
    })

    it('should display singular section title', () => {
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
  })

  describe('When multi artists', () => {
    it('should display correctly', () => {
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

    it('should display plural section title', () => {
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
})
