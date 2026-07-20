import React from 'react'

import { SubcategoryIdEnum } from 'api/gen'
import { ArtistPlaylist } from 'features/artist/components/ArtistPlaylist/ArtistPlaylist'
import { PlaylistType } from 'features/offer/enums'
import { mockedAlgoliaOffersWithSameArtistResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { AlgoliaOfferWithArtistAndEan } from 'libs/algolia/types'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import * as ABSegmentModule from 'shared/useABSegment/useABSegment'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent, waitFor } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

const useABSegmentSpy = jest.spyOn(ABSegmentModule, 'useABSegment')
const user = userEvent.setup()

describe('ArtistPlaylist', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    setFeatureFlags()
  })

  it('should display one artist playlist per non-empty category', async () => {
    render(
      reactQueryProviderHOC(
        <ArtistPlaylist
          artist={{ id: '1', name: 'Céline Dion' }}
          items={[
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
          onViewableItemsChanged={jest.fn()}
        />
      )
    )

    await screen.findByLabelText('Prochains concerts et festivals')

    expect(screen.getByLabelText('Prochains concerts et festivals')).toBeOnTheScreen()
    expect(screen.getByLabelText('Livres')).toBeOnTheScreen()
    expect(screen.getByLabelText('Prochains festivals et salons du livre')).toBeOnTheScreen()
    expect(screen.queryByLabelText('Toutes ses offres disponibles')).not.toBeOnTheScreen()
    expect(screen.getAllByText('Concert')[0]).toBeOnTheScreen()
    expect(screen.getByText('Livre papier')).toBeOnTheScreen()
    expect(screen.getByText('Festival livre')).toBeOnTheScreen()
  })

  it('should trigger ConsultOffer log with good parameters when pressing a playlist item', async () => {
    render(
      reactQueryProviderHOC(
        <ArtistPlaylist
          artist={{ id: '1', name: 'Céline Dion' }}
          items={[
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
          onViewableItemsChanged={jest.fn()}
        />
      )
    )

    await user.press(screen.getByText('Livre papier'))

    expect(analytics.logConsultOffer).toHaveBeenCalledWith(
      expect.objectContaining({
        artistName: 'Céline Dion',
        displayAdvice: false,
        from: 'artist',
        isHeadline: false,
        offerId: '2',
        originDetails: 'artistRecommendation',
        playlistType: PlaylistType.ARTIST_CATEGORY_PLAYLIST,
        venueId: 4070,
      })
    )
  })

  it('should not display playlists for offers excluded from artist category mapping', async () => {
    render(
      reactQueryProviderHOC(
        <ArtistPlaylist
          artist={{ id: '1', name: 'Céline Dion' }}
          items={[
            buildArtistOffer({
              objectID: '1',
              name: 'Jeu vidéo',
              subcategoryId: SubcategoryIdEnum.JEU_SUPPORT_PHYSIQUE,
            }),
          ]}
          onViewableItemsChanged={jest.fn()}
        />
      )
    )

    await waitFor(() => expect(screen.queryByText('Jeu vidéo')).not.toBeOnTheScreen())
  })

  it('should not display artist playlist when there is not some offer from this artist', async () => {
    render(
      reactQueryProviderHOC(
        <ArtistPlaylist
          artist={{ id: '1', name: 'Céline Dion' }}
          items={[]}
          onViewableItemsChanged={jest.fn()}
        />
      )
    )

    await waitFor(() => expect(screen.queryByLabelText('Livres')).not.toBeOnTheScreen())
  })

  it('should display see all button when there are several offers from this artist', async () => {
    render(
      reactQueryProviderHOC(
        <ArtistPlaylist
          artist={{ id: '1', name: 'Céline Dion' }}
          items={mockedAlgoliaOffersWithSameArtistResponse}
          onViewableItemsChanged={jest.fn()}
        />
      )
    )

    expect(await screen.findByLabelText('Voir tout pour la sélection Livres')).toBeOnTheScreen()
  })

  it('should not display see all button when there is only one offer from this artist', async () => {
    render(
      reactQueryProviderHOC(
        <ArtistPlaylist
          artist={{ id: '1', name: 'Céline Dion' }}
          items={[mockedAlgoliaOffersWithSameArtistResponse[0]]}
          onViewableItemsChanged={jest.fn()}
        />
      )
    )

    await screen.findByLabelText('Livres')

    expect(screen.queryByLabelText('Voir tout pour la sélection Livres')).not.toBeOnTheScreen()
  })

  it('should use bookFormat if available in playlist item', async () => {
    render(
      reactQueryProviderHOC(
        <ArtistPlaylist
          artist={{ id: '1', name: 'Céline Dion' }}
          items={mockedAlgoliaOffersWithSameArtistResponse}
          onViewableItemsChanged={jest.fn()}
        />
      )
    )

    await screen.findByLabelText('Livres')

    expect(screen.getByText('Poche')).toBeOnTheScreen()
  })

  it('should not use bookFormat if is not in playlist item', async () => {
    render(
      reactQueryProviderHOC(
        <ArtistPlaylist
          artist={{ id: '1', name: 'Céline Dion' }}
          items={mockedAlgoliaOffersWithSameArtistResponse}
          onViewableItemsChanged={jest.fn()}
        />
      )
    )

    await screen.findByLabelText('Livres')

    expect(screen.getAllByText('Livre')[1]).toBeOnTheScreen()
  })

  it('should trigger analytics with category playlist title when we click on "Voir tout" button', async () => {
    render(
      reactQueryProviderHOC(
        <ArtistPlaylist
          artist={{ id: '1', name: 'Céline Dion' }}
          items={mockedAlgoliaOffersWithSameArtistResponse}
          onViewableItemsChanged={jest.fn()}
        />
      )
    )

    await user.press(screen.getByLabelText('Voir tout pour la sélection Livres'))

    expect(analytics.logClickSeeAll).toHaveBeenCalledWith({
      type: 'artists',
      moduleName: 'Livres',
      moduleId: 'artist_offers_0_livres',
      from: 'artist',
    })
  })

  it('should display pro advices tag when defined and pro advices AB testing segment is A and wipProReviewsPlaylist FF activated', async () => {
    render(
      reactQueryProviderHOC(
        <ArtistPlaylist
          artist={{ id: '1', name: 'Céline Dion' }}
          items={[
            {
              ...mockedAlgoliaOffersWithSameArtistResponse[0],
              offer: { ...mockedAlgoliaOffersWithSameArtistResponse[0].offer, proAdvicesCount: 1 },
            },
          ]}
          onViewableItemsChanged={jest.fn()}
          proAdvicesSegment="A"
          enableProAdvicesTag
        />
      )
    )

    await screen.findByLabelText('Livres')

    expect(screen.getByText('1 avis')).toBeOnTheScreen()
  })

  it('should not display pro advices tag when defined and pro advices AB testing segment is B and wipProReviewsPlaylist FF activated', async () => {
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_PRO_REVIEWS_PLAYLIST])
    useABSegmentSpy.mockReturnValueOnce('B')
    render(
      reactQueryProviderHOC(
        <ArtistPlaylist
          artist={{ id: '1', name: 'Céline Dion' }}
          items={[
            {
              ...mockedAlgoliaOffersWithSameArtistResponse[0],
              offer: { ...mockedAlgoliaOffersWithSameArtistResponse[0].offer, proAdvicesCount: 1 },
            },
          ]}
          onViewableItemsChanged={jest.fn()}
        />
      )
    )

    await screen.findByLabelText('Livres')

    expect(screen.queryByText('1 avis')).not.toBeOnTheScreen()
  })

  it('should not display pro advices tag when defined and pro advices AB testing segment is A and wipProReviewsPlaylist FF deactivated', async () => {
    useABSegmentSpy.mockReturnValueOnce('A')
    render(
      reactQueryProviderHOC(
        <ArtistPlaylist
          artist={{ id: '1', name: 'Céline Dion' }}
          items={[
            {
              ...mockedAlgoliaOffersWithSameArtistResponse[0],
              offer: { ...mockedAlgoliaOffersWithSameArtistResponse[0].offer, proAdvicesCount: 1 },
            },
          ]}
          onViewableItemsChanged={jest.fn()}
        />
      )
    )

    await screen.findByLabelText('Livres')

    expect(screen.queryByText('1 avis')).not.toBeOnTheScreen()
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
