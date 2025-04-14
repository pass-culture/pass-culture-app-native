import React from 'react'
import { InViewProps } from 'react-native-intersection-observer'

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
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { userEvent, render, screen, waitFor } from 'tests/utils'

jest.mock('libs/subcategories/useSubcategories')

const mockInView = jest.fn()
jest.mock('react-native-intersection-observer', () => {
  const InView = (props: InViewProps) => {
    mockInView.mockImplementation(props.onChange)
    return null
  }
  return {
    ...jest.requireActual('react-native-intersection-observer'),
    InView,
  }
})

const mockSearchHits = [...mockedAlgoliaResponse.hits, ...moreHitsForSimilarOffersPlaylist]

const offerPlaylistListProps: OfferPlaylistListProps = {
  offer: mockOffer,
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

        await user.press(screen.getByText('La nuit des temps'))

        expect(push).toHaveBeenCalledWith('Offer', {
          from: 'offer',
          fromOfferId: mockOffer.id,
          id: 102280,
          playlistType: PlaylistType.OTHER_CATEGORIES_SIMILAR_OFFERS,
        })
      })
    })

    describe('For tracking purpose...', () => {
      // TODO(PC-0000) to unskip the test we need to mock the layout on FlatList
      it.skip('should expose viewable items of visible playlists', async () => {
        renderOfferPlaylistList({
          ...offerPlaylistListProps,
          sameCategorySimilarOffers: mockSearchHits,
        })

        const allPlaylistElements = await screen.findAllByTestId('offersModuleList')
        const playlistElement = allPlaylistElements.at(0)

        if (!playlistElement) {
          throw new Error('Playlist not found')
        }
        mockInView(true)

        await user.scrollTo(playlistElement, {
          layoutMeasurement: { width: 600, height: 300 },
          contentSize: { width: 1200, height: 300 },
          x: 0,
        })

        await waitFor(() =>
          expect(mockPlaylistViewableItemsChanged).toHaveBeenCalledWith('Dans la même catégorie', [
            '102280',
            '102272',
            '102249',
            '102310',
            '102281',
          ])
        )
      })

      it('should not expose viewable items when playlists are offscreen', async () => {
        renderOfferPlaylistList({
          ...offerPlaylistListProps,
          sameCategorySimilarOffers: mockSearchHits,
        })

        const allPlaylistElements = await screen.findAllByTestId('offersModuleList')
        const playlistElement = allPlaylistElements.at(0)

        if (!playlistElement) {
          throw new Error('Playlist not found')
        }
        mockInView(false)

        await user.scrollTo(playlistElement, {
          layoutMeasurement: { width: 600, height: 300 },
          contentSize: { width: 1200, height: 300 },
          x: 0,
        })

        await waitFor(() => expect(mockPlaylistViewableItemsChanged).not.toHaveBeenCalled())
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
        onPlaylistViewableItemsChanged={mockPlaylistViewableItemsChanged}
      />
    )
  )
