import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import {
  ArtistType,
  CategoryIdEnum,
  OfferArtist,
  SearchGroupNameEnumv2,
  SubcategoryIdEnum,
} from 'api/gen'
import { OfferArtistsSection } from 'features/offer/components/OfferArtistsSection/OfferArtistsSection'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
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

const renderOfferArtistsSection = (artists: OfferArtist[]) =>
  render(
    reactQueryProviderHOC(
      <OfferArtistsSection
        artists={artists}
        offerCategoryId={CategoryIdEnum.MUSIQUE_ENREGISTREE}
        offerSubcategoryId={SubcategoryIdEnum.SUPPORT_PHYSIQUE_MUSIQUE_VINYLE}
        offerSearchGroupName={SearchGroupNameEnumv2.MUSIQUE}
        onPlaylistItemPress={jest.fn()}
        offerId={1}
      />
    )
  )

describe('<OfferArtistsSection />', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  describe('When single artist', () => {
    it('should display correctly', () => {
      renderOfferArtistsSection([mockArtist])

      expect(screen.getByText('Edith Piaf')).toBeOnTheScreen()
    })

    it('should display default avatar when image not defined', () => {
      renderOfferArtistsSection([mockArtist])

      expect(screen.getByTestId('defaultArtistAvatar')).toBeOnTheScreen()
    })

    it('should display artist image when image defined', () => {
      renderOfferArtistsSection([{ ...mockArtist, image: 'url' }])

      expect(screen.getByTestId('ArtistImage')).toBeOnTheScreen()
    })

    it('should display role as subtitle when role defined', () => {
      renderOfferArtistsSection([{ ...mockArtist, role: ArtistType.author }])

      expect(screen.getByText('Auteur')).toBeOnTheScreen()
      expect(screen.getByTestId('subtitleWithTitle')).toBeOnTheScreen()
    })

    it('should redirect to artist page when pressing button', async () => {
      renderOfferArtistsSection([mockArtist])

      await user.press(screen.getByLabelText('Accéder à la page artiste de Edith Piaf'))

      expect(navigate).toHaveBeenCalledWith('Artist', { id: '1' })
    })

    it('should not have redirection to artist page when artist has not id', () => {
      renderOfferArtistsSection([{ ...mockArtist, id: undefined }])

      expect(
        screen.queryByLabelText('Accéder à la page artiste de Edith Piaf')
      ).not.toBeOnTheScreen()
    })

    it('should display singular section title', () => {
      renderOfferArtistsSection([mockArtist])

      expect(screen.getAllByText('Artiste')[0]).toBeOnTheScreen()
    })

    it('should not display filter buttons', () => {
      renderOfferArtistsSection([mockArtist])

      expect(screen.queryByTestId('filterButtons')).not.toBeOnTheScreen()
    })
  })

  describe('When multi artists', () => {
    it('should display correctly', () => {
      renderOfferArtistsSection(mockMultiArtists)

      expect(screen.getByText('Sam Worthington')).toBeOnTheScreen()
      expect(screen.getByText('Zoe Saldana')).toBeOnTheScreen()
      expect(screen.getByText('Sigourney Weaver')).toBeOnTheScreen()
    })

    it('should display plural section title', () => {
      renderOfferArtistsSection(mockMultiArtists)

      expect(screen.getByText('Artistes')).toBeOnTheScreen()
    })

    it('should not display filter buttons when there are only artists with the same role', () => {
      renderOfferArtistsSection(mockMultiArtists)

      expect(screen.queryByTestId('filterButtons')).not.toBeOnTheScreen()
    })

    it('should display filter buttons when there are artists with different roles', () => {
      renderOfferArtistsSection([...mockMultiArtists, mockFilmDirector])

      expect(screen.getByLabelText('Acteurs : Filtre non sélectionné')).toBeOnTheScreen()
      expect(screen.getByLabelText('Réalisateur : Filtre non sélectionné')).toBeOnTheScreen()
    })

    it('should display all artists by default', () => {
      renderOfferArtistsSection([...mockMultiArtists, mockFilmDirector])

      expect(screen.getByText('Sam Worthington')).toBeOnTheScreen()
      expect(screen.getByText('Zoe Saldana')).toBeOnTheScreen()
      expect(screen.getByText('Sigourney Weaver')).toBeOnTheScreen()
      expect(screen.getByText('James Cameron')).toBeOnTheScreen()
    })

    it('should filter artists when pressing filter button', async () => {
      renderOfferArtistsSection([...mockMultiArtists, mockFilmDirector])

      await user.press(screen.getByLabelText('Réalisateur : Filtre non sélectionné'))

      expect(screen.getByText('James Cameron')).toBeOnTheScreen()
      expect(screen.queryByText('Sam Worthington')).not.toBeOnTheScreen()
      expect(screen.queryByText('Zoe Saldana')).not.toBeOnTheScreen()
      expect(screen.queryByText('Sigourney Weaver')).not.toBeOnTheScreen()
    })

    it('should display all artists when pressing filter button then deselected', async () => {
      renderOfferArtistsSection([...mockMultiArtists, mockFilmDirector])

      await user.press(screen.getByLabelText('Réalisateur : Filtre non sélectionné'))

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
      renderOfferArtistsSection(mockMultiArtists)

      expect(screen.getByText('Voir tout')).toBeOnTheScreen()
    })

    it('should not display see all button when there is only one artist', () => {
      renderOfferArtistsSection([mockArtist])

      expect(screen.queryByText('Voir tout')).not.toBeOnTheScreen()
    })

    it('should trigger ClickSeeAll log when pressing see all button', async () => {
      renderOfferArtistsSection(mockMultiArtists)

      await user.press(screen.getByText('Voir tout'))

      expect(analytics.logClickSeeAll).toHaveBeenCalledWith({
        from: 'offer',
        moduleName: 'Artistes',
        type: 'artists',
      })
    })

    it('should redirect to VerticalPlaylistArtists when pressing see all button', async () => {
      renderOfferArtistsSection(mockMultiArtists)

      await user.press(screen.getByText('Voir tout'))

      expect(navigate).toHaveBeenCalledWith('VerticalPlaylistArtists', {
        offerId: 1,
        title: 'Artistes',
        originDetails: 'offer',
      })
    })
  })

  describe('Follow artist fake door', () => {
    it('should display follow button for the single artist when FF activated', () => {
      setFeatureFlags([RemoteStoreFeatureFlags.WIP_ARTIST_FAKE_DOOR])
      renderOfferArtistsSection([mockArtist])

      expect(screen.getByLabelText('Suivre Edith Piaf')).toBeOnTheScreen()
    })

    it('should display follow button for each artist when FF activated', () => {
      setFeatureFlags([RemoteStoreFeatureFlags.WIP_ARTIST_FAKE_DOOR])
      renderOfferArtistsSection(mockMultiArtists)

      expect(screen.getByLabelText('Suivre Sam Worthington')).toBeOnTheScreen()
      expect(screen.getByLabelText('Suivre Zoe Saldana')).toBeOnTheScreen()
      expect(screen.getByLabelText('Suivre Sigourney Weaver')).toBeOnTheScreen()
    })

    it('should not display follow button when FF deactivated', () => {
      renderOfferArtistsSection([mockArtist])

      expect(screen.queryByLabelText('Suivre Edith Piaf')).not.toBeOnTheScreen()
    })

    it('should open fake door modal with artistId and offer type when pressing follow button', async () => {
      setFeatureFlags([RemoteStoreFeatureFlags.WIP_ARTIST_FAKE_DOOR])
      renderOfferArtistsSection([mockArtist])

      await user.press(screen.getByLabelText('Suivre Edith Piaf'))

      expect(navigate).toHaveBeenCalledWith('FakeDoorModal', {
        surveyKey: 'has_seen_follow_artist_fake_door_survey',
        surveyUrl:
          'https://passculture.qualtrics.com/jfe/form/SV_0wafZvbQ06UrZnU?artistId=1&offer_type=MUSIQUE',
      })
    })

    it('should open fake door modal without artistId when artist has no id', async () => {
      setFeatureFlags([RemoteStoreFeatureFlags.WIP_ARTIST_FAKE_DOOR])
      renderOfferArtistsSection([{ ...mockArtist, id: undefined }])

      await user.press(screen.getByLabelText('Suivre Edith Piaf'))

      expect(navigate).toHaveBeenCalledWith('FakeDoorModal', {
        surveyKey: 'has_seen_follow_artist_fake_door_survey',
        surveyUrl:
          'https://passculture.qualtrics.com/jfe/form/SV_0wafZvbQ06UrZnU?offer_type=MUSIQUE',
      })
    })

    it('should open fake door modal with offer type from a multi artists list', async () => {
      setFeatureFlags([RemoteStoreFeatureFlags.WIP_ARTIST_FAKE_DOOR])
      renderOfferArtistsSection(mockMultiArtists)

      await user.press(screen.getByLabelText('Suivre Zoe Saldana'))

      expect(navigate).toHaveBeenCalledWith('FakeDoorModal', {
        surveyKey: 'has_seen_follow_artist_fake_door_survey',
        surveyUrl:
          'https://passculture.qualtrics.com/jfe/form/SV_0wafZvbQ06UrZnU?artistId=2&offer_type=MUSIQUE',
      })
    })
  })
})
