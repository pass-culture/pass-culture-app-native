import React from 'react'

import { push } from '__mocks__/@react-navigation/native'
import { OfferPagePlaylist } from 'api/gen'
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
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { useAlgoliaSimilarOffersQuery } from 'queries/offer/useAlgoliaSimilarOffersQuery'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { userEvent, render, screen, act, fireEvent } from 'tests/utils'

jest.mock('queries/subcategories/useSubcategoriesQuery')
jest.mock('queries/offer/useAlgoliaSimilarOffersQuery')

const mockUseAlgoliaSimilarOffersQuery = useAlgoliaSimilarOffersQuery as jest.Mock

const mockSearchHits = [...mockedAlgoliaResponse.hits, ...moreHitsForSimilarOffersPlaylist]

const mockApiParams = {
  recoOrigin: 'similar_offer',
  modelOrigin: 'default',
  callId: '4c0364f6-9398-465f-9b30-8286a54670a3',
  uniqueCallId: 'deebda22-4ef6-4c1f-b1cc-f772efd21a6c',
  abTest: 'main',
}

const mockSameCategoryPlaylist: OfferPagePlaylist = {
  title: 'Les fans aiment aussi',
  analyticsPlaylistType: PlaylistType.SAME_CATEGORY_SIMILAR_OFFERS,
  results: ['102280'],
  params: mockApiParams,
}

const mockBooksPlaylist: OfferPagePlaylist = {
  title: 'Dans la même catégorie',
  analyticsPlaylistType: PlaylistType.BOOKS_SAME_CATEGORY_SIMILAR_OFFERS,
  results: ['102280'],
  params: mockApiParams,
}

const mockPlaylistViewableItemsChanged = jest.fn()
const mockOnBeforeNavigate = jest.fn()

let mockOnIntersectionChange: ((inView: boolean) => void) | undefined

jest.mock('shared/ObservedPlaylist/ObservedPlaylist', () => ({
  ObservedPlaylist: ({ children, onIntersectionChange }) => {
    mockOnIntersectionChange = onIntersectionChange
    return children({ listRef: { current: null } })
  },
}))

const user = userEvent.setup()
jest.useFakeTimers()

describe('<OfferPlaylistList />', () => {
  beforeEach(() => {
    setFeatureFlags()
    mockUseAlgoliaSimilarOffersQuery.mockImplementation((results: string[]) =>
      results.length ? mockSearchHits : []
    )
  })

  it('should not display playlist when offer has not it', async () => {
    renderOfferPlaylistList({ playlists: [] })

    await act(() => {})

    expect(screen.queryByText('Les fans aiment aussi')).not.toBeOnTheScreen()
  })

  it('should not display playlist when offer has it and that matches on Algolia are not being found', async () => {
    mockUseAlgoliaSimilarOffersQuery.mockReturnValueOnce([])

    renderOfferPlaylistList({
      playlists: [mockSameCategoryPlaylist],
    })

    await act(() => {})

    expect(screen.queryByLabelText('Les fans aiment aussi')).not.toBeOnTheScreen()
  })

  it('should display playlist when offer has it', async () => {
    renderOfferPlaylistList({
      playlists: [mockSameCategoryPlaylist, mockBooksPlaylist],
    })

    expect(await screen.findByLabelText('Les fans aiment aussi')).toBeOnTheScreen()
    expect(screen.getByLabelText('Dans la même catégorie')).toBeOnTheScreen()
  })

  it('should navigate to an offer when pressing on it', async () => {
    renderOfferPlaylistList({
      playlists: [mockSameCategoryPlaylist],
    })

    await user.press(screen.getByText('La nuit des temps'))

    expect(push).toHaveBeenCalledWith('Offer', {
      from: 'offer',
      fromOfferId: mockOffer.id,
      id: 102280,
      playlistType: PlaylistType.SAME_CATEGORY_SIMILAR_OFFERS,
      apiRecoParams: JSON.stringify(mockApiParams),
    })
  })

  it('should trigger PlaylistHorizontalScroll log on end playlist reached', async () => {
    renderOfferPlaylistList({
      playlists: [mockSameCategoryPlaylist],
    })

    const flatList = await screen.findByTestId('offersModuleList')
    fireEvent(flatList, 'onEndReached')

    expect(analytics.logPlaylistHorizontalScroll).toHaveBeenCalledWith(
      undefined,
      PlaylistType.SAME_CATEGORY_SIMILAR_OFFERS,
      mockApiParams
    )
  })

  describe('Vertical scroll', () => {
    it('should trigger PlaylistVerticalScroll log when playlist is visible', async () => {
      renderOfferPlaylistList({
        playlists: [mockSameCategoryPlaylist],
      })

      await act(() => {
        mockOnIntersectionChange?.(true)
      })

      expect(analytics.logPlaylistVerticalScroll).toHaveBeenCalledWith({
        ...mockApiParams,
        fromOfferId: undefined,
        offerId: mockOffer.id,
        playlistType: PlaylistType.SAME_CATEGORY_SIMILAR_OFFERS,
        nbResults: mockSearchHits.length,
      })
    })

    it('should trigger PlaylistVerticalScroll log only one time', async () => {
      renderOfferPlaylistList({
        playlists: [mockSameCategoryPlaylist],
      })

      await act(() => {
        mockOnIntersectionChange?.(true)
      })
      await act(() => {
        mockOnIntersectionChange?.(false)
      })
      await act(() => {
        mockOnIntersectionChange?.(true)
      })

      expect(analytics.logPlaylistVerticalScroll).toHaveBeenCalledTimes(1)
    })
  })
})

const renderOfferPlaylistList = (props: Partial<OfferPlaylistListProps> = {}) =>
  render(
    reactQueryProviderHOC(
      <OfferPlaylistList
        offer={mockOffer}
        playlists={[]}
        onViewableItemsChanged={mockPlaylistViewableItemsChanged}
        seeAllButton={{
          navigateToVerticalPlaylist: jest.fn(),
          onBeforeNavigate: mockOnBeforeNavigate,
        }}
        {...props}
      />
    )
  )
