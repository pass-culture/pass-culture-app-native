import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { ArtistType, CategoryIdEnum, SubcategoryIdEnum } from 'api/gen'
import { OfferArtistsSection } from 'features/offer/components/OfferArtistsSection/OfferArtistsSection'
import { analytics } from 'libs/analytics/provider'
import { render, screen, userEvent } from 'tests/utils'

const mockArtist = { id: '1', name: 'Edith Piaf' }
const mockMultiArtists = [
  { id: '1', name: 'Sam Worthington', role: ArtistType.film_actor },
  { id: '2', name: 'Zoe Saldana', role: ArtistType.film_actor },
  { id: '3', name: 'Sigourney Weaver', role: ArtistType.film_actor },
]
const mockFilmDirector = { id: '4', name: 'James Cameron', role: ArtistType.film_director }

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
          offerId={1}
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
          offerId={1}
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
          offerId={1}
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
          offerId={1}
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
          offerId={1}
        />
      )

      await user.press(screen.getByLabelText('Accéder à la page artiste de Edith Piaf'))

      expect(navigate).toHaveBeenCalledWith('Artist', { id: '1' })
    })

    it('should not have redirection to artist page when artist has not id', () => {
      render(
        <OfferArtistsSection
          artists={[{ ...mockArtist, id: undefined }]}
          offerCategoryId={CategoryIdEnum.MUSIQUE_ENREGISTREE}
          offerSubcategoryId={SubcategoryIdEnum.SUPPORT_PHYSIQUE_MUSIQUE_VINYLE}
          onPlaylistItemPress={jest.fn()}
          offerId={1}
        />
      )

      expect(
        screen.queryByLabelText('Accéder à la page artiste de Edith Piaf')
      ).not.toBeOnTheScreen()
    })

    it('should display singular section title', () => {
      render(
        <OfferArtistsSection
          artists={[mockArtist]}
          offerCategoryId={CategoryIdEnum.MUSIQUE_ENREGISTREE}
          offerSubcategoryId={SubcategoryIdEnum.SUPPORT_PHYSIQUE_MUSIQUE_VINYLE}
          onPlaylistItemPress={jest.fn()}
          offerId={1}
        />
      )

      expect(screen.getAllByText('Artiste')[0]).toBeOnTheScreen()
    })

    it('should not display filter buttons', () => {
      render(
        <OfferArtistsSection
          artists={[mockArtist]}
          offerCategoryId={CategoryIdEnum.MUSIQUE_ENREGISTREE}
          offerSubcategoryId={SubcategoryIdEnum.SUPPORT_PHYSIQUE_MUSIQUE_VINYLE}
          onPlaylistItemPress={jest.fn()}
          offerId={1}
        />
      )

      expect(screen.queryByTestId('filterButtons')).not.toBeOnTheScreen()
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
          offerId={1}
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
          offerId={1}
        />
      )

      expect(screen.getByText('Artistes')).toBeOnTheScreen()
    })

    it('should not display filter buttons when there are only artists with the same role', () => {
      render(
        <OfferArtistsSection
          artists={mockMultiArtists}
          offerCategoryId={CategoryIdEnum.MUSIQUE_ENREGISTREE}
          offerSubcategoryId={SubcategoryIdEnum.SUPPORT_PHYSIQUE_MUSIQUE_VINYLE}
          onPlaylistItemPress={jest.fn()}
          offerId={1}
        />
      )

      expect(screen.queryByTestId('filterButtons')).not.toBeOnTheScreen()
    })

    it('should display filter buttons when there are artists with different roles', () => {
      render(
        <OfferArtistsSection
          artists={[...mockMultiArtists, mockFilmDirector]}
          offerCategoryId={CategoryIdEnum.MUSIQUE_ENREGISTREE}
          offerSubcategoryId={SubcategoryIdEnum.SUPPORT_PHYSIQUE_MUSIQUE_VINYLE}
          onPlaylistItemPress={jest.fn()}
          offerId={1}
        />
      )

      expect(screen.getByLabelText('Acteurs')).toBeOnTheScreen()
      expect(screen.getByLabelText('Réalisateur')).toBeOnTheScreen()
    })

    it('should display all artists by default', () => {
      render(
        <OfferArtistsSection
          artists={[...mockMultiArtists, mockFilmDirector]}
          offerCategoryId={CategoryIdEnum.MUSIQUE_ENREGISTREE}
          offerSubcategoryId={SubcategoryIdEnum.SUPPORT_PHYSIQUE_MUSIQUE_VINYLE}
          onPlaylistItemPress={jest.fn()}
          offerId={1}
        />
      )

      expect(screen.getByText('Sam Worthington')).toBeOnTheScreen()
      expect(screen.getByText('Zoe Saldana')).toBeOnTheScreen()
      expect(screen.getByText('Sigourney Weaver')).toBeOnTheScreen()
      expect(screen.getByText('James Cameron')).toBeOnTheScreen()
    })

    it('should filter artists when pressing filter button', async () => {
      render(
        <OfferArtistsSection
          artists={[...mockMultiArtists, mockFilmDirector]}
          offerCategoryId={CategoryIdEnum.MUSIQUE_ENREGISTREE}
          offerSubcategoryId={SubcategoryIdEnum.SUPPORT_PHYSIQUE_MUSIQUE_VINYLE}
          onPlaylistItemPress={jest.fn()}
          offerId={1}
        />
      )

      await user.press(screen.getByLabelText('Réalisateur'))

      expect(screen.getByText('James Cameron')).toBeOnTheScreen()
      expect(screen.queryByText('Sam Worthington')).not.toBeOnTheScreen()
      expect(screen.queryByText('Zoe Saldana')).not.toBeOnTheScreen()
      expect(screen.queryByText('Sigourney Weaver')).not.toBeOnTheScreen()
    })

    it('should display all artists when pressing filter button then deselected', async () => {
      render(
        <OfferArtistsSection
          artists={[...mockMultiArtists, mockFilmDirector]}
          offerCategoryId={CategoryIdEnum.MUSIQUE_ENREGISTREE}
          offerSubcategoryId={SubcategoryIdEnum.SUPPORT_PHYSIQUE_MUSIQUE_VINYLE}
          onPlaylistItemPress={jest.fn()}
          offerId={1}
        />
      )

      await user.press(screen.getByLabelText('Réalisateur'))

      expect(screen.getByText('James Cameron')).toBeOnTheScreen()
      expect(screen.queryByText('Sam Worthington')).not.toBeOnTheScreen()
      expect(screen.queryByText('Zoe Saldana')).not.toBeOnTheScreen()
      expect(screen.queryByText('Sigourney Weaver')).not.toBeOnTheScreen()

      await user.press(screen.getByLabelText('Réalisateur : Filtre sélectionné'))

      expect(screen.getByText('Sam Worthington')).toBeOnTheScreen()
      expect(screen.getByText('Zoe Saldana')).toBeOnTheScreen()
      expect(screen.getByText('Sigourney Weaver')).toBeOnTheScreen()
      expect(screen.getByText('James Cameron')).toBeOnTheScreen()
    })

    it('should display see all button when there are several artists', () => {
      render(
        <OfferArtistsSection
          artists={mockMultiArtists}
          offerCategoryId={CategoryIdEnum.MUSIQUE_ENREGISTREE}
          offerSubcategoryId={SubcategoryIdEnum.SUPPORT_PHYSIQUE_MUSIQUE_VINYLE}
          onPlaylistItemPress={jest.fn()}
          offerId={1}
        />
      )

      expect(screen.getByText('Voir tout')).toBeOnTheScreen()
    })

    it('should not display see all button when there is only one artist', () => {
      render(
        <OfferArtistsSection
          artists={[mockArtist]}
          offerCategoryId={CategoryIdEnum.MUSIQUE_ENREGISTREE}
          offerSubcategoryId={SubcategoryIdEnum.SUPPORT_PHYSIQUE_MUSIQUE_VINYLE}
          onPlaylistItemPress={jest.fn()}
          offerId={1}
        />
      )

      expect(screen.queryByText('Voir tout')).not.toBeOnTheScreen()
    })

    it('should trigger ClickSeeAll log when pressing see all button', async () => {
      render(
        <OfferArtistsSection
          artists={mockMultiArtists}
          offerCategoryId={CategoryIdEnum.MUSIQUE_ENREGISTREE}
          offerSubcategoryId={SubcategoryIdEnum.SUPPORT_PHYSIQUE_MUSIQUE_VINYLE}
          onPlaylistItemPress={jest.fn()}
          offerId={1}
        />
      )

      await user.press(screen.getByText('Voir tout'))

      expect(analytics.logClickSeeAll).toHaveBeenCalledWith({
        from: 'offer',
        moduleName: 'Artistes',
        type: 'artists',
      })
    })

    it('should redirect to VerticalPlaylistArtists when pressing see all button', async () => {
      render(
        <OfferArtistsSection
          artists={mockMultiArtists}
          offerCategoryId={CategoryIdEnum.MUSIQUE_ENREGISTREE}
          offerSubcategoryId={SubcategoryIdEnum.SUPPORT_PHYSIQUE_MUSIQUE_VINYLE}
          onPlaylistItemPress={jest.fn()}
          offerId={1}
        />
      )

      await user.press(screen.getByText('Voir tout'))

      expect(navigate).toHaveBeenCalledWith('VerticalPlaylistArtists', {
        offerId: 1,
        title: 'Artistes',
      })
    })
  })
})
