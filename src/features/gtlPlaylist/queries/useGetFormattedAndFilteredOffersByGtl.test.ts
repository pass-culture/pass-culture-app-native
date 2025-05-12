import { contentfulGtlPlaylistSnap } from 'features/gtlPlaylist/fixtures/contentfulGtlPlaylistSnap'
import { gtlPlaylistRequestSnap } from 'features/gtlPlaylist/fixtures/gtlPlaylistRequestSnap'
import { useGetFormattedAndFilteredOffersByGtl } from 'features/gtlPlaylist/queries/useGetFormattedAndFilteredOffersByGtl'
import { GtlPlaylistRequest } from 'features/gtlPlaylist/types'
import { OffersModuleParameters } from 'features/home/types'
import { venueDataTest } from 'features/venue/fixtures/venueDataTest'
import { fetchOffersByGTL } from 'libs/algolia/fetchAlgolia/fetchOffersByGTL'
import { mockedAlgoliaResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { AlgoliaOffer, HitOffer, LocationMode, PlaylistOffersParams } from 'libs/algolia/types'
import { CONTENTFUL_BASE_URL } from 'libs/contentful/constants'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook } from 'tests/utils'

jest.mock('libs/jwt/jwt')
jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))

jest.mock('libs/algolia/fetchAlgolia/fetchOffersByGTL')
const mockFetchOffersByGTL = fetchOffersByGTL as jest.Mock
mockFetchOffersByGTL.mockResolvedValue([mockedAlgoliaResponse])

describe('useGetFormattedAndFilteredOffersByGtl', () => {
  beforeEach(() => {
    mockServer.universalGet(`${CONTENTFUL_BASE_URL}/entries`, contentfulGtlPlaylistSnap)
  })

  it('should return formatted playlists', async () => {
    const { result } = renderUseGetFormattedAndFilteredOffersByGtl()

    await act(async () => {})

    expect(result.current.data?.[0]).toEqual({
      entryId: '5fThoWkm590x6drqnHe0Jl',
      layout: 'two-items',
      minNumberOfOffers: 1,
      offers: { hits: mockedAlgoliaResponse.hits },
      title: 'Romance',
    })
  })

  it('should return empty array if the minNumberOfOffers is higher than the number of offers', async () => {
    const filteredGtlPlaylistsConfig = [
      {
        id: '5fThoWkm590x6drqnHe0Jl',
        displayParameters: {
          title: 'Romance',
          layout: 'two-items',
          minOffers: 10,
        },
        offersModuleParameters: {
          title: 'Romance',
          isGeolocated: false,
          minBookingsThreshold: 1,
          hitsPerPage: 35,
          gtlLevel: 1,
          gtlLabel: 'Romance',
          categories: ['Livres'],
        },
      },
    ] as GtlPlaylistRequest[]
    const { result } = renderUseGetFormattedAndFilteredOffersByGtl(filteredGtlPlaylistsConfig)

    await act(async () => {})

    expect(result.current.data).toEqual([])
  })
})

const mockAdaptPlaylistParameters = (parameters: OffersModuleParameters): PlaylistOffersParams => ({
  offerParams: {
    hitsPerPage: parameters.hitsPerPage,
    offerCategories: [],
    offerSubcategories: [],
    offerIsDuo: false,
    isDigital: false,
    priceRange: [0, 300],
    tags: [],
    date: null,
    timeRange: null,
    query: '',
    minBookingsThreshold: parameters.minBookingsThreshold,
    offerGenreTypes: [],
    offerGtlLabel: 'Romance',
    offerGtlLevel: 3,
  },
  locationParams: {
    selectedLocationMode: LocationMode.EVERYWHERE,
    userLocation: null,
    aroundMeRadius: 'all',
    aroundPlaceRadius: 'all',
  },
})

const transformHits = (hit: AlgoliaOffer<HitOffer>) => hit

const renderUseGetFormattedAndFilteredOffersByGtl = (
  filteredGtlPlaylistsConfig: GtlPlaylistRequest[] = gtlPlaylistRequestSnap
) =>
  renderHook(
    () =>
      useGetFormattedAndFilteredOffersByGtl(
        {
          filteredGtlPlaylistsConfig,
          venue: venueDataTest,
          searchIndex: undefined,
          userLocation: { latitude: 48, longitude: -1 },
          selectedLocationMode: LocationMode.AROUND_ME,
          isUserUnderage: false,
          adaptPlaylistParameters: mockAdaptPlaylistParameters,
        },
        transformHits
      ),
    {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    }
  )
