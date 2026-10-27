import { UseQueryResult } from '@tanstack/react-query'
import mockdate from 'mockdate'
import React, { ComponentProps, createRef } from 'react'
import { ScrollView } from 'react-native'

import { push } from '__mocks__/@react-navigation/native'
import { Activity, VenueResponse } from 'api/gen'
import { gtlPlaylistAlgoliaSnapshot } from 'features/gtlPlaylist/fixtures/gtlPlaylistAlgoliaSnapshot'
import { mockLabelMapping, mockMapping } from 'features/headlineOffer/fixtures/mockMapping'
import { OfferCTAProvider } from 'features/offer/components/OfferContent/OfferCTAProvider'
import { initialSearchState } from 'features/search/context/reducer'
import { SpecialEventVenueMovies } from 'features/venue/components/VenueOffers/SpecialEventVenueMovies'
import { VenueMoviesV2 } from 'features/venue/components/VenueOffers/VenueMoviesV2'
import { VenueOffers } from 'features/venue/components/VenueOffers/VenueOffers'
import { venueDataTest } from 'features/venue/fixtures/venueDataTest'
import { VenueOffersArtistsResponseSnap } from 'features/venue/fixtures/venueOffersArtistsResponseSnap'
import {
  VenueMoviesOffersResponseSnap,
  VenueOffersResponseSnap,
} from 'features/venue/fixtures/venueOffersResponseSnap'
import * as venueSurveyAccessStorageModule from 'features/venue/helpers/venueSurveyAccessStorage'
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
  isLoading: false,
  data: { hits: VenueOffersResponseSnap, nbHits: 10 },
} as unknown as UseQueryResult<VenueOffersType, Error>)

mockdate.set(new Date('2021-08-15T00:00:00Z'))

jest.mock('queries/subcategories/useSubcategoriesQuery')

const defaultParams = {
  date: null,
  hitsPerPage: 50,
  offerCategories: [],
  offerSubcategories: [],
  offerIsDuo: false,
  isDigital: false,
  maxPrice: 300,
  minPrice: 0,
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

jest.mock('features/venue/components/VenueOffers/SpecialEventVenueMovies', () => ({
  SpecialEventVenueMovies: jest.fn(() => null),
}))

jest.mock('features/venue/components/VenueOffers/VenueMoviesV2', () => ({
  VenueMoviesV2: jest.fn(() => null),
}))

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const mockCheckVenueSurveyAccess = jest.spyOn(
  venueSurveyAccessStorageModule,
  'checkVenueSurveyAccess'
)
const mockMarkVenueSurveyAccess = jest.spyOn(
  venueSurveyAccessStorageModule,
  'markVenueSurveyAccess'
)

const venueWithSurveyActivity: VenueResponse = {
  ...venueDataTest,
  activity: Activity.BOOKSTORE,
}

const user = userEvent.setup()

jest.useFakeTimers()

describe('<VenueOffers />', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  it('should display skeleton if offers are fetching', () => {
    jest.spyOn(useVenueOffersQueryAPI, 'useVenueOffersQuery').mockReturnValueOnce({
      isLoading: true,
    } as UseQueryResult<VenueOffersType, Error>)
    renderVenueOffers({})

    expect(screen.getByTestId('OfferPlaylistSkeleton')).toBeOnTheScreen()
  })

  it('should display skeleton if playlists are fetching', async () => {
    renderVenueOffers({ arePlaylistsLoading: true })

    await screen.findByTestId('OfferPlaylistSkeleton')

    expect(screen.getByTestId('OfferPlaylistSkeleton')).toBeOnTheScreen()
  })

  it('should display specific wording placeholder when no offers and venue open to public', async () => {
    renderVenueOffers({ venueOffers: { hits: [], nbHits: 0 } })

    expect(
      await screen.findByText('Il n’y a pas encore d’offre disponible dans ce lieu')
    ).toBeOnTheScreen()
  })

  it('should display specific wording placeholder when no offers and venue not open to public', async () => {
    renderVenueOffers({
      venueOffers: { hits: [], nbHits: 0 },
      venue: { ...venueDataTest, isOpenToPublic: false },
    })

    expect(
      await screen.findByText('Cette structure ne propose pas encore d’offre')
    ).toBeOnTheScreen()
  })

  it('should display "Voir tout" button', async () => {
    renderVenueOffers({ playlists: [] })

    await screen.findByLabelText('Toutes les offres')

    expect(screen.getByText('Voir tout')).toBeOnTheScreen()
  })

  it(`should go to search page with venue infos when clicking "Voir tout" button`, async () => {
    renderVenueOffers({ playlists: [] })

    await user.press(screen.getByText('Voir tout'))

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

  it(`should log analytics event when clicking "Voir tout" button`, async () => {
    renderVenueOffers({ playlists: [] })

    await user.press(screen.getByText('Voir tout'))

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

    it('should use special event venue movies when special event screenings are enabled', () => {
      setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_SPECIAL_EVENT_SCREENINGS])

      renderVenueOffers({ venueOffers: venueMoviesOffersMock })

      expect(SpecialEventVenueMovies).toHaveBeenCalledTimes(1)
    })

    it('should keep cinema V2 when both cinema flags are enabled', () => {
      setFeatureFlags([
        RemoteStoreFeatureFlags.ENABLE_SPECIAL_EVENT_SCREENINGS,
        RemoteStoreFeatureFlags.WIP_USE_VENUE_MOVIE_SCREENINGS_ENDPOINT,
      ])

      renderVenueOffers({ venueOffers: venueMoviesOffersMock })

      expect(SpecialEventVenueMovies).not.toHaveBeenCalled()
      expect(VenueMoviesV2).toHaveBeenCalledTimes(1)
    })
  })

  describe('Artist playlist', () => {
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
        artistId: '1',
        artistName: 'Freida McFadden',
        from: 'venue',
        venueId: venueDataTest.id.toString(),
      })
    })

    it('should not display artists playlist when venue offers have not artists', async () => {
      renderVenueOffers({})

      await screen.findByLabelText('Toutes les offres')

      expect(screen.queryByText('Les artistes disponibles dans ce lieu')).not.toBeOnTheScreen()
    })

    it('should display see all button when there are several artists in the playlist', async () => {
      renderVenueOffers({
        venueArtists: venueOffersArtistsMock,
      })

      expect(
        await screen.findByLabelText(
          'Voir tout pour la sélection Les artistes disponibles dans ce lieu'
        )
      ).toBeOnTheScreen()
    })

    it('should not display see all button when there is only one artist in the playlist', async () => {
      renderVenueOffers({
        venueArtists: { artists: [VenueOffersArtistsResponseSnap[0]] },
      })

      await screen.findByText('Les artistes disponibles dans ce lieu')

      expect(
        screen.queryByLabelText('Voir tout pour la sélection Les artistes disponibles dans ce lieu')
      ).not.toBeOnTheScreen()
    })
  })

  describe('Venue survey banner', () => {
    it('should not display the survey banner when enableVenueSurvey FF is deactivated', () => {
      setFeatureFlags()

      renderVenueOffers({ venue: venueWithSurveyActivity })

      expect(screen.queryByText(/Un avis sur cette page/)).not.toBeOnTheScreen()
    })

    describe('when enableVenueSurvey FF is activated', () => {
      beforeEach(() => {
        setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_VENUE_SURVEY])
      })

      it('should display the survey banner when survey has not been accessed yet', async () => {
        mockCheckVenueSurveyAccess.mockResolvedValueOnce(false)

        renderVenueOffers({ venue: venueWithSurveyActivity })

        expect(await screen.findByText(/Un avis sur cette page/)).toBeOnTheScreen()
        expect(screen.getByText('Donner mon avis (2 min)')).toBeOnTheScreen()
      })

      it('should not display the survey banner when survey has already been accessed', () => {
        mockCheckVenueSurveyAccess.mockResolvedValueOnce(true)

        renderVenueOffers({ venue: venueWithSurveyActivity })

        expect(screen.queryByText(/Un avis sur cette page/)).not.toBeOnTheScreen()
      })

      it('should not display the survey banner when venue activity has no survey mapped', () => {
        renderVenueOffers({
          venue: { ...venueDataTest, activity: null },
        })

        expect(screen.queryByText(/Un avis sur cette page/)).not.toBeOnTheScreen()
      })

      it('should mark survey access and hide the banner when pressing "Donner mon avis"', async () => {
        mockCheckVenueSurveyAccess.mockResolvedValueOnce(false)

        renderVenueOffers({ venue: venueWithSurveyActivity })

        await user.press(await screen.findByText('Donner mon avis (2 min)'))

        expect(mockMarkVenueSurveyAccess).toHaveBeenNthCalledWith(1, 'BOOKSHOP_AND_LIBRARY')
        expect(screen.queryByText(/Un avis sur cette page/)).not.toBeOnTheScreen()
      })

      it('should display the survey banner when there are no offers', async () => {
        mockCheckVenueSurveyAccess.mockResolvedValueOnce(false)

        renderVenueOffers({
          venue: venueWithSurveyActivity,
          venueOffers: { hits: [], nbHits: 0 },
        })

        expect(await screen.findByText(/Un avis sur cette page/)).toBeOnTheScreen()
      })

      it('should display the survey banner when there are movie screening offers', async () => {
        mockCheckVenueSurveyAccess.mockResolvedValueOnce(false)

        renderVenueOffers({
          venue: { ...venueWithSurveyActivity, activity: Activity.CINEMA },
          venueOffers: venueMoviesOffersMock,
        })

        expect(await screen.findByText(/Un avis sur cette page/)).toBeOnTheScreen()
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
