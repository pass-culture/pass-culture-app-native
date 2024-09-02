import React from 'react'

import { push } from '__mocks__/@react-navigation/native'
import { mockOffer } from 'features/bookOffer/fixtures/offer'
import {
  OfferPlaylistList,
  OfferPlaylistListProps,
} from 'features/offer/components/OfferPlaylistList/OfferPlaylistList'
import { PlaylistType } from 'features/offer/enums'
import {
  mockedAlgoliaOffersWithSameArtistResponse,
  mockedAlgoliaResponse,
  moreHitsForSimilarOffersPlaylist,
} from 'libs/algolia/fixtures/algoliaFixtures'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { DEFAULT_REMOTE_CONFIG } from 'libs/firebase/remoteConfig/remoteConfig.constants'
import { CustomRemoteConfig } from 'libs/firebase/remoteConfig/remoteConfig.types'
import * as useRemoteConfigContext from 'libs/firebase/remoteConfig/RemoteConfigProvider'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen } from 'tests/utils'

jest.mock('libs/subcategories/useSubcategories')

const mockDistance: string | null = null
jest.mock('libs/location/hooks/useDistance', () => ({
  useDistance: () => mockDistance,
}))

const useFeatureFlagSpy = jest
  .spyOn(useFeatureFlag, 'useFeatureFlag')
  // this value corresponds to WIP_SAME_ARTIST_PLAYLIST feature flag
  .mockReturnValue(false)

const useRemoteConfigContextSpy = jest.spyOn(useRemoteConfigContext, 'useRemoteConfigContext')

const mockSearchHits = [...mockedAlgoliaResponse.hits, ...moreHitsForSimilarOffersPlaylist]

const offerPlaylistListProps: OfferPlaylistListProps = {
  offer: mockOffer,
}

const defaultRemoteConfig: CustomRemoteConfig = {
  ...DEFAULT_REMOTE_CONFIG,
  sameAuthorPlaylist: 'sameAuthorPlaylist',
}

jest.mock('@shopify/flash-list', () => {
  const ActualFlashList = jest.requireActual('@shopify/flash-list').FlashList
  class MockFlashList extends ActualFlashList {
    componentDidMount() {
      super.componentDidMount()
      this.rlvRef?._scrollComponent?._scrollViewRef?.props?.onLayout({
        nativeEvent: { layout: { height: 250, width: 800 } },
      })
    }
  }
  return {
    ...jest.requireActual('@shopify/flash-list'),
    FlashList: MockFlashList,
  }
})

describe('<OfferPlaylistList />', () => {
  describe('Similar offers', () => {
    describe('Same category playlist', () => {
      it('should not display same category playlist when offer has not it', () => {
        renderOfferPlaylistList(offerPlaylistListProps)

        expect(screen.queryByText('Dans la même catégorie')).not.toBeOnTheScreen()
      })

      it('should display same category playlist when offer has it', () => {
        renderOfferPlaylistList({
          ...offerPlaylistListProps,
          sameCategorySimilarOffers: mockSearchHits,
        })

        expect(screen.getByText('Dans la même catégorie')).toBeOnTheScreen()
      })

      it('should navigate to an offer when pressing on it', async () => {
        renderOfferPlaylistList({
          ...offerPlaylistListProps,
          sameCategorySimilarOffers: mockSearchHits,
        })

        // @ts-expect-error: because of noUncheckedIndexedAccess
        await fireEvent.press(screen.queryAllByText('La nuit des temps')[0])

        expect(push).toHaveBeenCalledWith('Offer', {
          from: 'offer',
          fromOfferId: mockOffer.id,
          id: 102280,
          playlistType: PlaylistType.SAME_CATEGORY_SIMILAR_OFFERS,
        })
      })
    })

    describe('Other categories differents from that of the offer', () => {
      it('should not display other categories playlist when offer has not it', () => {
        renderOfferPlaylistList(offerPlaylistListProps)

        expect(screen.queryByText('Ça peut aussi te plaire')).not.toBeOnTheScreen()
      })

      it('should display other categories playlist when offer has it', () => {
        renderOfferPlaylistList({
          ...offerPlaylistListProps,
          otherCategoriesSimilarOffers: mockSearchHits,
        })

        expect(screen.getByText('Ça peut aussi te plaire')).toBeOnTheScreen()
      })

      it('should navigate to an offer when pressing on it', async () => {
        renderOfferPlaylistList({
          ...offerPlaylistListProps,
          otherCategoriesSimilarOffers: mockSearchHits,
        })

        // @ts-expect-error: because of noUncheckedIndexedAccess
        await fireEvent.press(screen.queryAllByText('La nuit des temps')[0])

        expect(push).toHaveBeenCalledWith('Offer', {
          from: 'offer',
          fromOfferId: mockOffer.id,
          id: 102280,
          playlistType: PlaylistType.OTHER_CATEGORIES_SIMILAR_OFFERS,
        })
      })
    })
  })

  describe('Same artist playlist with "wipSameArtistPlaylist" feature flag activated', () => {
    beforeEach(() => {
      useFeatureFlagSpy
        // this value corresponds to WIP_SAME_ARTIST_PLAYLIST feature flag
        .mockReturnValue(true)
    })

    it('should display same artist list when offer has some and same author playlist remote config value is withPlaylistAsFirst', () => {
      useRemoteConfigContextSpy.mockReturnValueOnce({
        ...defaultRemoteConfig,
        sameAuthorPlaylist: 'withPlaylistAsFirst',
      })
      renderOfferPlaylistList({
        ...offerPlaylistListProps,
        sameArtistPlaylist: mockedAlgoliaOffersWithSameArtistResponse,
      })

      expect(screen.getByText('Du même auteur')).toBeOnTheScreen()
    })

    it('should display same artist list when offer has some and same author playlist remote config value is withPlaylistAsLast', () => {
      useRemoteConfigContextSpy.mockReturnValueOnce({
        ...defaultRemoteConfig,
        sameAuthorPlaylist: 'withPlaylistAsLast',
      })
      renderOfferPlaylistList({
        ...offerPlaylistListProps,
        sameArtistPlaylist: mockedAlgoliaOffersWithSameArtistResponse,
      })

      expect(screen.getByText('Du même auteur')).toBeOnTheScreen()
    })

    it('should not display same artist list when offer has not it', () => {
      useRemoteConfigContextSpy.mockReturnValueOnce({
        ...defaultRemoteConfig,
        sameAuthorPlaylist: 'withPlaylistAsFirst',
      })
      renderOfferPlaylistList(offerPlaylistListProps)

      expect(screen.queryByText('Du même auteur')).not.toBeOnTheScreen()
    })

    it('should not display same artist playlist when same author playlist remote config value is withoutPlaylit', () => {
      useRemoteConfigContextSpy.mockReturnValueOnce({
        ...defaultRemoteConfig,
        sameAuthorPlaylist: 'withoutPlaylit',
      })

      renderOfferPlaylistList({
        ...offerPlaylistListProps,
        sameArtistPlaylist: mockedAlgoliaOffersWithSameArtistResponse,
      })

      expect(screen.queryByText('Du même auteur')).not.toBeOnTheScreen()
    })
  })

  describe('Same artist playlist with "wipSameArtistPlaylist" feature flag deactivated', () => {
    beforeEach(() => {
      useFeatureFlagSpy
        // this value corresponds to WIP_SAME_ARTIST_PLAYLIST feature flag
        .mockReturnValueOnce(false)
    })

    it('should not display same artist list when offer has some', () => {
      renderOfferPlaylistList({
        ...offerPlaylistListProps,
        sameArtistPlaylist: mockedAlgoliaOffersWithSameArtistResponse,
      })

      expect(screen.queryByText('Du même auteur')).not.toBeOnTheScreen()
    })

    it('should not display same artist list when offer has not it', () => {
      renderOfferPlaylistList(offerPlaylistListProps)

      expect(screen.queryByText('Du même auteur')).not.toBeOnTheScreen()
    })
  })
})

const renderOfferPlaylistList = ({
  offer = mockOffer,
  sameCategorySimilarOffers,
  otherCategoriesSimilarOffers,
  sameArtistPlaylist,
}: OfferPlaylistListProps) =>
  render(
    reactQueryProviderHOC(
      <OfferPlaylistList
        offer={offer}
        sameCategorySimilarOffers={sameCategorySimilarOffers}
        otherCategoriesSimilarOffers={otherCategoriesSimilarOffers}
        sameArtistPlaylist={sameArtistPlaylist}
      />
    )
  )
