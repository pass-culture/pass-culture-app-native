import React from 'react'
import { Share } from 'react-native'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { SubcategoryIdEnum } from 'api/gen'
import { ArtistBody } from 'features/artist/components/ArtistBody/ArtistBody'
import { mockArtist } from 'features/artist/fixtures/mockArtist'
import { mockOffer } from 'features/bookOffer/fixtures/offer'
import * as useGoBack from 'features/navigation/useGoBack'
import { mockedAlgoliaOffersWithSameArtistResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { AlgoliaOfferWithArtistAndEan } from 'libs/algolia/types'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent, waitFor } from 'tests/utils'

jest.unmock('react-native/Libraries/Animated/createAnimatedComponent')
jest.mock('libs/firebase/analytics/analytics')

const mockGoBack = jest.fn()
jest
  .spyOn(useGoBack, 'useGoBack')
  .mockReturnValue({ goBack: mockGoBack, canGoBack: jest.fn(() => true) })

const mockUseOfferQuery = jest.fn()
mockUseOfferQuery.mockReturnValue({
  data: {
    ...mockOffer,
    subcategoryId: SubcategoryIdEnum.SUPPORT_PHYSIQUE_MUSIQUE_CD,
    artists: [
      { id: '1', name: 'Céline Dion' },
      { id: '2', name: 'Sia' },
    ],
  },
})

jest.mock('queries/offer/useOfferQuery', () => ({ useOffer: () => mockUseOfferQuery() }))

useRoute.mockReturnValue({ params: { fromOfferId: 1 } })

const mockShare = jest.spyOn(Share, 'share').mockImplementation(jest.fn())

const user = userEvent.setup()

jest.useFakeTimers()

describe('<ArtistBody />', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  it('should display only the main artist when there are several artists on header title', async () => {
    render(
      reactQueryProviderHOC(
        <ArtistBody
          artist={mockArtist}
          artistPlaylist={[]}
          artistTopOffers={[]}
          onViewableItemsChanged={jest.fn()}
          onExpandBioPress={jest.fn()}
        />
      )
    )

    await screen.findAllByText('Avril Lavigne')

    expect(screen.getAllByText('Avril Lavigne')[0]).toBeOnTheScreen()
  })

  it('should call goBack when pressing the back button', async () => {
    render(
      reactQueryProviderHOC(
        <ArtistBody
          artist={mockArtist}
          artistPlaylist={[]}
          artistTopOffers={[]}
          onViewableItemsChanged={jest.fn()}
          onExpandBioPress={jest.fn()}
        />
      )
    )
    const backButton = screen.getByTestId('Revenir en arrière')
    await user.press(backButton)

    expect(mockGoBack).toHaveBeenCalledTimes(1)
  })

  it('should display correct artist avatar', async () => {
    render(
      reactQueryProviderHOC(
        <ArtistBody
          artist={{
            ...mockArtist,
            image: '/passculture-metier-ehp-staging-assets-fine-grained/thumbs/mediations/998Q',
          }}
          artistPlaylist={[]}
          artistTopOffers={[]}
          onViewableItemsChanged={jest.fn()}
          onExpandBioPress={jest.fn()}
        />
      )
    )
    await waitFor(() => {
      expect(screen.getByTestId('artistAvatar')).toBeOnTheScreen()
    })
  })

  it('should display default artist avatar when artist has not image', async () => {
    const artist = {
      ...mockArtist,
      image: undefined,
    }
    render(
      reactQueryProviderHOC(
        <ArtistBody
          artist={artist}
          artistPlaylist={[]}
          artistTopOffers={[]}
          onViewableItemsChanged={jest.fn()}
          onExpandBioPress={jest.fn()}
        />
      )
    )

    expect(await screen.findByTestId('BicolorProfile')).toBeOnTheScreen()
  })

  it('should display artist description', async () => {
    render(
      reactQueryProviderHOC(
        <ArtistBody
          artist={mockArtist}
          artistPlaylist={[]}
          artistTopOffers={[]}
          onViewableItemsChanged={jest.fn()}
          onExpandBioPress={jest.fn()}
        />
      )
    )

    expect(await screen.findByText('À propos')).toBeOnTheScreen()
    expect(screen.getByText(/Il s’agit d’une chanteuse canadienne/)).toBeOnTheScreen()
  })

  it('should not display source and credit description when defined and description not expanded', () => {
    render(
      reactQueryProviderHOC(
        <ArtistBody
          artist={mockArtist}
          artistPlaylist={[]}
          artistTopOffers={[]}
          onViewableItemsChanged={jest.fn()}
          onExpandBioPress={jest.fn()}
        />
      )
    )

    expect(screen.queryByText('© Contenu généré par IA')).not.toBeOnTheScreen()
    expect(screen.queryByText('Source : Wikipédia')).not.toBeOnTheScreen()
  })

  it('should display source and credit description when defined and description expanded', async () => {
    render(
      reactQueryProviderHOC(
        <ArtistBody
          artist={mockArtist}
          artistPlaylist={[]}
          artistTopOffers={[]}
          onViewableItemsChanged={jest.fn()}
          onExpandBioPress={jest.fn()}
        />
      )
    )

    await user.press(screen.getByText('Voir plus'))

    expect(screen.getByText('© Contenu généré par IA')).toBeOnTheScreen()
    expect(screen.getByText('Source : Wikipédia')).toBeOnTheScreen()
  })

  it('should navigate to artist webview page when pressing Wikipedia button', async () => {
    render(
      reactQueryProviderHOC(
        <ArtistBody
          artist={mockArtist}
          artistPlaylist={[]}
          artistTopOffers={[]}
          onViewableItemsChanged={jest.fn()}
          onExpandBioPress={jest.fn()}
        />
      )
    )

    await user.press(screen.getByText('Voir plus'))

    await user.press(screen.getByText('Source : Wikipédia'))

    expect(navigate).toHaveBeenCalledWith('ArtistWebview', { id: mockArtist.id })
  })

  it('should log analytics when clicking on the share button', async () => {
    render(
      reactQueryProviderHOC(
        <ArtistBody
          artist={mockArtist}
          artistPlaylist={[]}
          artistTopOffers={[]}
          onViewableItemsChanged={jest.fn()}
          onExpandBioPress={jest.fn()}
        />
      )
    )

    const shareButton = screen.getByLabelText('Partager')

    await user.press(shareButton)

    expect(analytics.logShare).toHaveBeenNthCalledWith(1, {
      type: 'Artist',
      from: 'artist',
      artistId: mockArtist.id,
      artistName: mockArtist.name,
    })
  })

  it('should share when clicking on the share button', async () => {
    render(
      reactQueryProviderHOC(
        <ArtistBody
          artist={mockArtist}
          artistPlaylist={[]}
          artistTopOffers={[]}
          onViewableItemsChanged={jest.fn()}
          onExpandBioPress={jest.fn()}
        />
      )
    )

    const shareButton = screen.getByLabelText('Partager')

    await user.press(shareButton)

    expect(mockShare).toHaveBeenCalledWith(
      {
        message: 'Retrouve "Avril Lavigne" sur le pass Culture\u00a0:\n',
        url: 'https://webapp-v2.example.com/artiste/cb22d035-f081-4ccb-99d8-8f5725a8ac9c?utm_gen=product&utm_campaign=share_artist&utm_medium=header',
      },
      { subject: 'Retrouve "Avril Lavigne" sur le pass Culture' }
    )
  })

  it('should display artist playlist by category when wipArtistCategoryPlaylists FF activated', async () => {
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_ARTIST_CATEGORY_PLAYLISTS])
    render(
      reactQueryProviderHOC(
        <ArtistBody
          artist={mockArtist}
          artistPlaylist={[
            buildArtistOffer({
              objectID: '1',
              name: 'Concert',
              subcategoryId: SubcategoryIdEnum.CONCERT,
            }),
            buildArtistOffer({
              objectID: '2',
              name: 'Livre papier',
              subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
            }),
            buildArtistOffer({
              objectID: '3',
              name: 'Festival livre',
              subcategoryId: SubcategoryIdEnum.FESTIVAL_LIVRE,
            }),
          ]}
          artistTopOffers={[]}
          onViewableItemsChanged={jest.fn()}
          onExpandBioPress={jest.fn()}
        />
      )
    )

    expect(await screen.findByLabelText('Prochains concerts et festivals')).toBeOnTheScreen()
    expect(screen.getByLabelText('Livres')).toBeOnTheScreen()
    expect(screen.getByLabelText('Prochains festivals et salons du livre')).toBeOnTheScreen()
  })

  it('should not display artist playlist by category when wipArtistCategoryPlaylists FF deactivated', async () => {
    render(
      reactQueryProviderHOC(
        <ArtistBody
          artist={mockArtist}
          artistPlaylist={[
            buildArtistOffer({
              objectID: '1',
              name: 'Concert',
              subcategoryId: SubcategoryIdEnum.CONCERT,
            }),
            buildArtistOffer({
              objectID: '2',
              name: 'Livre papier',
              subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
            }),
            buildArtistOffer({
              objectID: '3',
              name: 'Festival livre',
              subcategoryId: SubcategoryIdEnum.FESTIVAL_LIVRE,
            }),
          ]}
          artistTopOffers={[]}
          onViewableItemsChanged={jest.fn()}
          onExpandBioPress={jest.fn()}
        />
      )
    )

    await screen.findAllByText('Avril Lavigne')

    expect(screen.queryByLabelText('Prochains concerts et festivals')).not.toBeOnTheScreen()
    expect(screen.queryByLabelText('Livres')).not.toBeOnTheScreen()
    expect(screen.queryByLabelText('Prochains festivals et salons du livre')).not.toBeOnTheScreen()
  })

  it('should display follow button when wipArtistFakeDoor FF activated', async () => {
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_ARTIST_FAKE_DOOR])
    render(
      reactQueryProviderHOC(
        <ArtistBody
          artist={mockArtist}
          artistPlaylist={[]}
          artistTopOffers={[]}
          onViewableItemsChanged={jest.fn()}
          onExpandBioPress={jest.fn()}
        />
      )
    )

    expect(await screen.findByLabelText('Suivre cet artiste')).toBeOnTheScreen()
  })

  it('should not display follow button when wipArtistFakeDoor FF deactivated', async () => {
    render(
      reactQueryProviderHOC(
        <ArtistBody
          artist={mockArtist}
          artistPlaylist={[]}
          artistTopOffers={[]}
          onViewableItemsChanged={jest.fn()}
          onExpandBioPress={jest.fn()}
        />
      )
    )

    await screen.findAllByText('Avril Lavigne')

    expect(screen.queryByLabelText('Suivre cet artiste')).not.toBeOnTheScreen()
  })

  it('should open fake door modal when pressing follow button', async () => {
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_ARTIST_FAKE_DOOR])
    render(
      reactQueryProviderHOC(
        <ArtistBody
          artist={mockArtist}
          artistPlaylist={[]}
          artistTopOffers={[]}
          onViewableItemsChanged={jest.fn()}
          onExpandBioPress={jest.fn()}
        />
      )
    )

    await user.press(await screen.findByLabelText('Suivre cet artiste'))

    expect(navigate).toHaveBeenCalledWith('FakeDoorModal', {
      surveyKey: 'has_seen_follow_artist_fake_door_survey',
      surveyUrl: 'https://passculture.qualtrics.com/jfe/form/SV_0wafZvbQ06UrZnU',
    })
  })

  it('should expose only the text to screen readers (emoji ignored)', async () => {
    render(
      reactQueryProviderHOC(
        <ArtistBody
          artist={mockArtist}
          artistPlaylist={[]}
          artistTopOffers={[]}
          onViewableItemsChanged={jest.fn()}
          onExpandBioPress={jest.fn()}
        />
      )
    )

    await user.press(screen.getByText('Voir plus'))

    expect(screen.getByLabelText('© Contenu généré par IA')).toBeTruthy()
    expect(screen.queryByLabelText('© Contenu généré par IA ✨')).toBeNull()
    expect(screen.queryByText('© Contenu généré par IA ✨')).toBeNull()
  })
})

const buildArtistOffer = ({
  name,
  objectID,
  subcategoryId,
}: {
  name: string
  objectID: string
  subcategoryId: SubcategoryIdEnum
}): AlgoliaOfferWithArtistAndEan => ({
  ...mockedAlgoliaOffersWithSameArtistResponse[0],
  objectID,
  offer: {
    ...mockedAlgoliaOffersWithSameArtistResponse[0].offer,
    bookFormat: undefined,
    name,
    subcategoryId,
  },
})
