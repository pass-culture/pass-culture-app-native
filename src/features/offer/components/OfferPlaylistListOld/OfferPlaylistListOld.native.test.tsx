import React from 'react'

import { push } from '__mocks__/@react-navigation/native'
import { mockOffer } from 'features/bookOffer/fixtures/offer'
import {
  OfferPlaylistListOld,
  OfferPlaylistListOldProps,
} from 'features/offer/components/OfferPlaylistListOld/OfferPlaylistListOld'
import { PlaylistType } from 'features/offer/enums'
import {
  mockedAlgoliaOffersWithSameArtistResponse,
  mockedAlgoliaResponse,
  moreHitsForSimilarOffersPlaylist,
} from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { placeholderData } from 'libs/subcategories/placeholderData'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen } from 'tests/utils'

const mockSubcategories = placeholderData.subcategories
const mockSearchGroups = placeholderData.searchGroups
jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: {
      subcategories: mockSubcategories,
      searchGroups: mockSearchGroups,
    },
  }),
}))

const useFeatureFlagSpy = jest
  .spyOn(useFeatureFlag, 'useFeatureFlag')
  // this value corresponds to WIP_SAME_ARTIST_PLAYLIST feature flag
  .mockReturnValue(false)

const mockSearchHits = [...mockedAlgoliaResponse.hits, ...moreHitsForSimilarOffersPlaylist]

const offerPlaylistListProps: OfferPlaylistListOldProps = {
  offer: mockOffer,
  position: null,
  handleChangeSameArtistPlaylistDisplay: jest.fn(),
}

describe('<OfferPlaylistList />', () => {
  describe('Similar offers', () => {
    describe('Same category playlist', () => {
      it('should not display same category playlist when offer has not it', () => {
        renderOfferPlaylistList(offerPlaylistListProps)

        expect(screen.queryByTestId('otherCategoriesSimilarOffers')).not.toBeOnTheScreen()
      })

      it('should display same category playlist when offer has it', () => {
        renderOfferPlaylistList({
          ...offerPlaylistListProps,
          sameCategorySimilarOffers: mockSearchHits,
        })

        expect(screen.queryByTestId('sameCategorySimilarOffers')).toBeOnTheScreen()
      })

      it('should navigate to an offer when pressing on it', async () => {
        renderOfferPlaylistList({
          ...offerPlaylistListProps,
          sameCategorySimilarOffers: mockSearchHits,
        })

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

        expect(screen.queryByTestId('otherCategoriesSimilarOffers')).not.toBeOnTheScreen()
      })

      it('should display other categories playlist when offer has it', () => {
        renderOfferPlaylistList({
          ...offerPlaylistListProps,
          otherCategoriesSimilarOffers: mockSearchHits,
        })

        expect(screen.queryByTestId('otherCategoriesSimilarOffers')).toBeOnTheScreen()
      })

      it('should navigate to an offer when pressing on it', async () => {
        renderOfferPlaylistList({
          ...offerPlaylistListProps,
          otherCategoriesSimilarOffers: mockSearchHits,
        })

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
        .mockReturnValueOnce(true)
    })

    it('should display same artist list when offer has some', () => {
      renderOfferPlaylistList({
        ...offerPlaylistListProps,
        sameArtistPlaylist: mockedAlgoliaOffersWithSameArtistResponse,
      })

      expect(screen.queryByTestId('sameArtistPlaylist')).toBeOnTheScreen()
    })

    it('should not display same artist list when offer has not it', () => {
      renderOfferPlaylistList(offerPlaylistListProps)

      expect(screen.queryByTestId('sameArtistPlaylist')).not.toBeOnTheScreen()
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

      expect(screen.queryByTestId('sameArtistPlaylist')).not.toBeOnTheScreen()
    })

    it('should not display same artist list when offer has not it', () => {
      renderOfferPlaylistList(offerPlaylistListProps)

      expect(screen.queryByTestId('sameArtistPlaylist')).not.toBeOnTheScreen()
    })
  })
})

const renderOfferPlaylistList = ({
  offer = mockOffer,
  position = null,
  sameCategorySimilarOffers,
  otherCategoriesSimilarOffers,
  sameArtistPlaylist,
  handleChangeSameArtistPlaylistDisplay,
}: OfferPlaylistListOldProps) =>
  render(
    reactQueryProviderHOC(
      <OfferPlaylistListOld
        offer={offer}
        position={position}
        sameCategorySimilarOffers={sameCategorySimilarOffers}
        otherCategoriesSimilarOffers={otherCategoriesSimilarOffers}
        sameArtistPlaylist={sameArtistPlaylist}
        handleChangeSameArtistPlaylistDisplay={handleChangeSameArtistPlaylistDisplay}
      />
    )
  )
