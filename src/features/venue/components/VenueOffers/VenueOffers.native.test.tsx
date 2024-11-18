import mockdate from 'mockdate'
import React, { createRef } from 'react'
import { ScrollView } from 'react-native'
import { UseQueryResult } from 'react-query'

import { push } from '__mocks__/@react-navigation/native'
import { VenueResponse, VenueTypeCodeKey } from 'api/gen'
import { gtlPlaylistAlgoliaSnapshot } from 'features/gtlPlaylist/fixtures/gtlPlaylistAlgoliaSnapshot'
import * as useGTLPlaylists from 'features/gtlPlaylist/hooks/useGTLPlaylists'
import { GtlPlaylistData } from 'features/gtlPlaylist/types'
import { initialSearchState } from 'features/search/context/reducer'
import * as useVenueOffers from 'features/venue/api/useVenueOffers'
import { VenueOffers } from 'features/venue/components/VenueOffers/VenueOffers'
import { venueDataTest } from 'features/venue/fixtures/venueDataTest'
import {
  VenueMoviesOffersResponseSnap,
  VenueOffersResponseSnap,
} from 'features/venue/fixtures/venueOffersResponseSnap'
import { analytics } from 'libs/analytics'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { LocationMode } from 'libs/location/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen } from 'tests/utils'
import { AnchorProvider } from 'ui/components/anchor/AnchorContext'

const mockFeatureFlag = jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValue(false)

const playlists = gtlPlaylistAlgoliaSnapshot
const mockVenue = venueDataTest
const venueId = venueDataTest.id

const useGTLPlaylistsSpy = jest
  .spyOn(useGTLPlaylists, 'useGTLPlaylists')
  .mockReturnValue({ isLoading: false, gtlPlaylists: gtlPlaylistAlgoliaSnapshot })
jest.spyOn(useVenueOffers, 'useVenueOffers').mockReturnValue({
  isLoading: false,
  data: { hits: VenueOffersResponseSnap, nbHits: 10 },
} as unknown as UseQueryResult<useVenueOffers.VenueOffers, unknown>)

mockdate.set(new Date('2021-08-15T00:00:00Z'))

jest.mock('libs/subcategories/useSubcategories')

const defaultParams = {
  date: null,
  hitsPerPage: 50,
  offerCategories: [],
  offerSubcategories: [],
  offerIsDuo: false,
  offerIsFree: false,
  isDigital: false,
  priceRange: [0, 300],
  query: '',
  tags: [],
  timeRange: null,
  locationFilter: {
    locationType: LocationMode.EVERYWHERE,
  },
}

const venueOffersMock = { hits: VenueOffersResponseSnap, nbHits: 4 }
const venueMoviesOffersMock = { hits: VenueMoviesOffersResponseSnap, nbHits: 4 }

const distributionStoreVenue = {
  ...mockVenue,
  venueTypeCode: VenueTypeCodeKey.DISTRIBUTION_STORE,
}

const bookstoreVenue = { ...mockVenue, venueTypeCode: VenueTypeCodeKey.BOOKSTORE }

const mockSearchState = initialSearchState
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
  }),
}))

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

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('<VenueOffers />', () => {
  it('should display skeleton if offers are fetching', () => {
    jest.spyOn(useVenueOffers, 'useVenueOffers').mockReturnValueOnce({
      isLoading: true,
    } as UseQueryResult<useVenueOffers.VenueOffers, unknown>)
    renderVenueOffers({ venue: venueDataTest, venueOffers: venueOffersMock })

    expect(screen.getByTestId('OfferPlaylistSkeleton')).toBeOnTheScreen()
  })

  it('should display skeleton if playlists are fetching', () => {
    useGTLPlaylistsSpy.mockReturnValueOnce({ isLoading: true, gtlPlaylists: [] })
    renderVenueOffers({ venue: venueDataTest, venueOffers: venueOffersMock })

    expect(screen.getByTestId('OfferPlaylistSkeleton')).toBeOnTheScreen()
  })

  it('should display placeholder when no offers', () => {
    renderVenueOffers({ venue: venueDataTest, venueOffers: { hits: [], nbHits: 0 } })

    expect(
      screen.getByText('Il n’y a pas encore d’offre disponible dans ce lieu')
    ).toBeOnTheScreen()
  })

  it('should display "En voir plus" button if they are more hits to see than the one displayed', () => {
    renderVenueOffers({ venue: venueDataTest, venueOffers: venueOffersMock })

    expect(screen.getByText('En voir plus')).toBeOnTheScreen()
  })

  it(`should not display "En voir plus" button if they are no more hits to see than the one displayed`, () => {
    renderVenueOffers({
      venue: venueDataTest,
      venueOffers: { hits: VenueOffersResponseSnap, nbHits: VenueOffersResponseSnap.length },
    })

    expect(screen.queryByText('En voir plus')).not.toBeOnTheScreen()
  })

  it(`should go to search page with venue infos when clicking "En voir plus" button`, async () => {
    renderVenueOffers({ venue: venueDataTest, venueOffers: venueOffersMock })

    fireEvent.press(screen.getByText('En voir plus'))

    await act(() => {})

    expect(push).toHaveBeenCalledWith('TabNavigator', {
      screen: 'SearchStackNavigator',
      params: {
        screen: 'SearchResults',
        params: {
          ...defaultParams,
          venue: {
            geolocation: { latitude: 48.87004, longitude: 2.3785 },
            info: 'Paris',
            label: 'Le Petit Rintintin 1',
            venueId: 5543,
          },
        },
      },
    })
  })

  it(`should log analytics event when clicking "En voir plus" button`, () => {
    renderVenueOffers({ venue: venueDataTest, venueOffers: venueOffersMock })
    fireEvent.press(screen.getByText('En voir plus'))

    expect(analytics.logVenueSeeMoreClicked).toHaveBeenNthCalledWith(1, venueId)
  })

  describe('should display all gtl playlists', () => {
    it('When there are gtl playlists associated to the venue and venue type is distribution store', () => {
      renderVenueOffers({ venue: bookstoreVenue, venueOffers: venueOffersMock, playlists })

      expect(screen.getByText('GTL playlist')).toBeOnTheScreen()
    })

    it('When there are gtl playlists associated to the venue and venue type is book store', () => {
      renderVenueOffers({
        venue: distributionStoreVenue,
        venueOffers: venueOffersMock,
        playlists,
      })

      expect(screen.getByText('GTL playlist')).toBeOnTheScreen()
    })
  })

  describe('should not display all gtl playlists', () => {
    it('When there are not gtl playlists associated to the venue and venue type is distribution store', () => {
      renderVenueOffers({ venue: bookstoreVenue, venueOffers: venueOffersMock })

      expect(screen.queryByText('GTL playlist')).not.toBeOnTheScreen()
    })

    it('When there are not gtl playlists associated to the venue and venue type is book store', () => {
      renderVenueOffers({ venue: distributionStoreVenue, venueOffers: venueOffersMock })

      expect(screen.queryByText('GTL playlist')).not.toBeOnTheScreen()
    })

    it('When there are gtl playlists associated to the venue and venue type is not distribution or book store', () => {
      renderVenueOffers({
        venue: { ...venueDataTest, venueTypeCode: undefined },
        venueOffers: venueOffersMock,
        playlists,
      })

      expect(screen.queryByText('GTL playlist')).not.toBeOnTheScreen()
    })
  })

  describe('Cinema venue', () => {
    beforeAll(() => {
      mockFeatureFlag.mockReturnValue(true)
    })

    it('should display movie screening calendar if at least one offer is a movie screening', async () => {
      renderVenueOffers({
        venue: venueDataTest,
        venueOffers: venueMoviesOffersMock,
      })

      expect(await screen.findByText('Les films à l’affiche')).toBeOnTheScreen()
    })
  })
})

const renderVenueOffers = ({
  venue,
  venueOffers,
  playlists,
}: {
  venue: VenueResponse
  venueOffers: useVenueOffers.VenueOffers
  playlists?: GtlPlaylistData[]
}) => {
  return render(
    reactQueryProviderHOC(
      <AnchorProvider scrollViewRef={createRef<ScrollView>()} handleCheckScrollY={() => 0}>
        <VenueOffers venue={venue} venueOffers={venueOffers} playlists={playlists} />
      </AnchorProvider>
    )
  )
}
