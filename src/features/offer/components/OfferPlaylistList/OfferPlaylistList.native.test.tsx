import React from 'react'

import { push } from '__mocks__/@react-navigation/native'
import { mockOffer } from 'features/bookOffer/fixtures/offer'
import {
  OfferPlaylistList,
  OfferPlaylistListProps,
} from 'features/offer/components/OfferPlaylistList/OfferPlaylistList'
import { PlaylistType } from 'features/offer/enums'
import {
  mockedAlgoliaResponse,
  moreHitsForSimilarOffersPlaylist,
} from 'libs/algolia/fixtures/algoliaFixtures'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { userEvent, render, screen, act } from 'tests/utils'

jest.mock('libs/subcategories/useSubcategories')

const mockSearchHits = [...mockedAlgoliaResponse.hits, ...moreHitsForSimilarOffersPlaylist]

const offerPlaylistListProps: OfferPlaylistListProps = {
  offer: mockOffer,
  onViewableItemsChanged: jest.fn(),
}

const user = userEvent.setup()
jest.useFakeTimers()

const mockPlaylistViewableItemsChanged = jest.fn()

describe('<OfferPlaylistList />', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  describe('Similar offers', () => {
    describe('Same category playlist', () => {
      it('should not display same category playlist when offer has not it', async () => {
        renderOfferPlaylistList(offerPlaylistListProps)

        await act(() => {})

        await expect(screen.queryByLabelText('Dans la même catégorie')).not.toBeOnTheScreen()
      })

      it('should display same category playlist when offer has it', async () => {
        renderOfferPlaylistList({
          ...offerPlaylistListProps,
          sameCategorySimilarOffers: mockSearchHits,
        })

        await screen.findByLabelText('Dans la même catégorie')

        expect(screen.getByLabelText('Dans la même catégorie')).toBeOnTheScreen()
      })

      it('should navigate to an offer when pressing on it', async () => {
        renderOfferPlaylistList({
          ...offerPlaylistListProps,
          sameCategorySimilarOffers: mockSearchHits,
        })

        await user.press(screen.getByText('La nuit des temps'))

        expect(push).toHaveBeenCalledWith('Offer', {
          from: 'offer',
          fromOfferId: mockOffer.id,
          id: 102280,
          playlistType: PlaylistType.SAME_CATEGORY_SIMILAR_OFFERS,
        })
      })
    })

    describe('Other categories differents from that of the offer', () => {
      it('should not display other categories playlist when offer has not it', async () => {
        renderOfferPlaylistList(offerPlaylistListProps)

        await act(() => {})

        expect(screen.queryByLabelText('Ça peut aussi te plaire')).not.toBeOnTheScreen()
      })

      it('should display other categories playlist when offer has it', async () => {
        renderOfferPlaylistList({
          ...offerPlaylistListProps,
          otherCategoriesSimilarOffers: mockSearchHits,
        })

        await screen.findByLabelText('Ça peut aussi te plaire')

        expect(screen.getByLabelText('Ça peut aussi te plaire')).toBeOnTheScreen()
      })

      it('should navigate to an offer when pressing on it', async () => {
        renderOfferPlaylistList({
          ...offerPlaylistListProps,
          otherCategoriesSimilarOffers: mockSearchHits,
        })

        await user.press(screen.getByText('La nuit des temps'))

        expect(push).toHaveBeenCalledWith('Offer', {
          from: 'offer',
          fromOfferId: mockOffer.id,
          id: 102280,
          playlistType: PlaylistType.OTHER_CATEGORIES_SIMILAR_OFFERS,
        })
      })
    })
  })
})

const renderOfferPlaylistList = ({
  offer = mockOffer,
  sameCategorySimilarOffers,
  otherCategoriesSimilarOffers,
}: OfferPlaylistListProps) =>
  render(
    reactQueryProviderHOC(
      <OfferPlaylistList
        offer={offer}
        sameCategorySimilarOffers={sameCategorySimilarOffers}
        otherCategoriesSimilarOffers={otherCategoriesSimilarOffers}
        onViewableItemsChanged={mockPlaylistViewableItemsChanged}
      />
    )
  )
