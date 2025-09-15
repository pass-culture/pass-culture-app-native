import { UseQueryResult } from '@tanstack/react-query'
import mockdate from 'mockdate'
import React, { ComponentProps, createRef } from 'react'
import { ScrollView } from 'react-native'

import { push } from '__mocks__/@react-navigation/native'
import { gtlPlaylistAlgoliaSnapshot } from 'features/gtlPlaylist/fixtures/gtlPlaylistAlgoliaSnapshot'
import { mockLabelMapping, mockMapping } from 'features/headlineOffer/fixtures/mockMapping'
import { OfferCTAProvider } from 'features/offer/components/OfferContent/OfferCTAProvider'
import { initialSearchState } from 'features/search/context/reducer'
import { VenueOffers } from 'features/venue/components/VenueOffers/VenueOffers'
import { venueDataTest } from 'features/venue/fixtures/venueDataTest'
import { VenueOffersArtistsResponseSnap } from 'features/venue/fixtures/venueOffersArtistsResponseSnap'
import {
  VenueMoviesOffersResponseSnap,
  VenueOffersResponseSnap,
} from 'features/venue/fixtures/venueOffersResponseSnap'
import type { VenueOffers as VenueOffersType } from 'features/venue/types'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { LocationMode } from 'libs/location/types'
import * as useVenueOffersQueryAPI from 'queries/venue/useVenueOffersQuery'
import { Currency } from 'shared/currency/useGetCurrencyToDisplay'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'
import { AnchorProvider } from 'ui/components/anchor/AnchorContext'

const venueId = venueDataTest.id

jest.spyOn(useVenueOffersQueryAPI, 'useVenueOffersQuery').mockReturnValue({
  isInitialLoading: false,
  data: { hits: VenueOffersResponseSnap, nbHits: 10 },
} as unknown as UseQueryResult<VenueOffersType, unknown>)

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
const venueOffersArtistsMock = { artists: VenueOffersArtistsResponseSnap }

const mockSearchState = initialSearchState
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
  }),
}))

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()

jest.useFakeTimers()

describe('<VenueOffers />', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  it('should display skeleton if offers are fetching', () => {
    jest.spyOn(useVenueOffersQueryAPI, 'useVenueOffersQuery').mockReturnValueOnce({
      isInitialLoading: true,
    } as UseQueryResult<VenueOffersType, unknown>)
    renderVenueOffers({})

    expect(screen.getByTestId('OfferPlaylistSkeleton')).toBeOnTheScreen()
  })

  it('should display skeleton if playlists are fetching', async () => {
    renderVenueOffers({ arePlaylistsLoading: true })

    await screen.findByTestId('OfferPlaylistSkeleton')

    expect(screen.getByTestId('OfferPlaylistSkeleton')).toBeOnTheScreen()
  })

  it('should display placeholder when no offers', async () => {
    renderVenueOffers({ venueOffers: { hits: [], nbHits: 0 } })

    await screen.findByText('Il n’y a pas encore d’offre disponible dans ce lieu')

    expect(
      screen.getByText('Il n’y a pas encore d’offre disponible dans ce lieu')
    ).toBeOnTheScreen()
  })

  it('should display "En voir plus" button if they are more hits to see than the one displayed', async () => {
    renderVenueOffers({ playlists: [] })

    await screen.findByLabelText('Toutes les offres')

    expect(screen.getByText('En voir plus')).toBeOnTheScreen()
  })

  it(`should not display "En voir plus" button if they are no more hits to see than the one displayed`, async () => {
    renderVenueOffers({
      venueOffers: { hits: VenueOffersResponseSnap, nbHits: VenueOffersResponseSnap.length },
    })

    await screen.findByLabelText('Toutes les offres')

    expect(screen.queryByText('En voir plus')).not.toBeOnTheScreen()
  })

  it(`should go to search page with venue infos when clicking "En voir plus" button`, async () => {
    renderVenueOffers({ playlists: [] })

    await user.press(screen.getByText('En voir plus'))

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

  it(`should log analytics event when clicking "En voir plus" button`, async () => {
    renderVenueOffers({ playlists: [] })

    await user.press(screen.getByText('En voir plus'))

    expect(analytics.logVenueSeeMoreClicked).toHaveBeenNthCalledWith(1, venueId)
  })

  it('should not display gtl playlist when gtl playlist is an empty array', async () => {
    renderVenueOffers({ playlists: [] })

    await screen.findByLabelText('Toutes les offres')

    expect(screen.queryByText('GTL playlist')).not.toBeOnTheScreen()
  })

  describe('Cinema venue', () => {
    it('should display movie screening calendar if at least one offer is a movie screening', async () => {
      renderVenueOffers({
        venueOffers: venueMoviesOffersMock,
      })

      expect(await screen.findByText('Les films à l’affiche')).toBeOnTheScreen()
    })
  })

  describe('Artist playlist', () => {
    describe('When wipVenueArtistsPlaylist feature flag activated', () => {
      beforeEach(() => {
        setFeatureFlags([RemoteStoreFeatureFlags.WIP_VENUE_ARTISTS_PLAYLIST])
      })

      it('should display artists playlist when venue offers have artists', async () => {
        renderVenueOffers({
          venueArtists: venueOffersArtistsMock,
        })

        await screen.findByText('Les artistes disponibles dans ce lieu')

        expect(screen.getByText('Les artistes disponibles dans ce lieu')).toBeOnTheScreen()
      })

      it('should trigger ConsultArtist log when pressing artists playlist item', async () => {
        renderVenueOffers({ venueArtists: venueOffersArtistsMock })

        await user.press(screen.getByText('Freida McFadden'))

        expect(analytics.logConsultArtist).toHaveBeenNthCalledWith(1, {
          artistName: 'Freida McFadden',
          from: 'venue',
          venueId: venueDataTest.id,
        })
      })

      it('should not display artists playlist when venue offers have artists', async () => {
        renderVenueOffers({})

        await screen.findByLabelText('Toutes les offres')

        expect(screen.queryByText('Les artistes disponibles dans ce lieu')).not.toBeOnTheScreen()
      })
    })

    describe('When wipVenueArtistsPlaylist feature flag deactivated', () => {
      it('should not display artists playlist when venue offers have artists', async () => {
        renderVenueOffers({
          venueArtists: venueOffersArtistsMock,
        })

        await screen.findByLabelText('Toutes les offres')

        expect(screen.queryByText('Les artistes disponibles dans ce lieu')).not.toBeOnTheScreen()
      })
    })
  })
})

type RenderVenueOffersType = Partial<ComponentProps<typeof VenueOffers>>

const renderVenueOffers = ({
  venue = venueDataTest,
  venueOffers = venueOffersMock,
  venueArtists,
  playlists = gtlPlaylistAlgoliaSnapshot,
  arePlaylistsLoading = false,
  mapping = mockMapping,
  labelMapping = mockLabelMapping,
  currency = Currency.EURO,
  euroToPacificFrancRate = 10,
}: RenderVenueOffersType) => {
  return render(
    reactQueryProviderHOC(
      <AnchorProvider scrollViewRef={createRef<ScrollView>()} handleCheckScrollY={() => 0}>
        <OfferCTAProvider>
          <VenueOffers
            venue={venue}
            venueOffers={venueOffers}
            venueArtists={venueArtists}
            playlists={playlists}
            arePlaylistsLoading={arePlaylistsLoading}
            mapping={mapping}
            labelMapping={labelMapping}
            currency={currency}
            euroToPacificFrancRate={euroToPacificFrancRate}
          />
        </OfferCTAProvider>
      </AnchorProvider>
    )
  )
}
