import { SubcategoriesResponseModelv2, VenueResponse, VenueTypeCodeKey } from 'api/gen'
import { contentfulGtlPlaylistSnap } from 'features/gtlPlaylist/fixtures/contentfulGtlPlaylistSnap'
import { useGTLPlaylistsQuery } from 'features/gtlPlaylist/queries/useGTLPlaylistsQuery'
import { OffersModuleParameters } from 'features/home/types'
import { fetchOffersByGTL } from 'libs/algolia/fetchAlgolia/fetchOffersByGTL'
import { mockedAlgoliaResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { AlgoliaOffer, HitOffer, PlaylistOffersParams } from 'libs/algolia/types'
import { ContentfulLabelCategories } from 'libs/contentful/types'
import { LocationMode, Position } from 'libs/location/types'
import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

jest.mock('libs/network/NetInfoWrapper')

const defaultVenue: VenueResponse = {
  name: 'Une librairie',
  city: 'Jest',
  id: 123,
  isVirtual: false,
  accessibility: {},
  timezone: 'Europe/Paris',
  venueTypeCode: VenueTypeCodeKey.BOOKSTORE,
  isOpenToPublic: true,
}

const mockLocationMode = LocationMode.AROUND_ME
const mockUserLocation: Position = { latitude: 2, longitude: 2 }
jest.mock('libs/location/LocationWrapper', () => ({
  useLocation: () => ({
    userLocation: mockUserLocation,
    selectedLocationMode: mockLocationMode,
  }),
}))

jest.mock('features/profile/helpers/useIsUserUnderage', () => ({
  useIsUserUnderage: jest.fn().mockReturnValue(false),
}))

jest.mock('libs/algolia/fetchAlgolia/fetchOffersByGTL')
const mockFetchOffersByGTL = fetchOffersByGTL as jest.Mock
mockFetchOffersByGTL.mockResolvedValue([mockedAlgoliaResponse])

jest.mock('libs/firebase/analytics/analytics')

describe('useGTLPlaylistsQuery', () => {
  beforeEach(() => {
    mockServer.getApi<SubcategoriesResponseModelv2>('/v1/subcategories/v2', subcategoriesDataTest)
  })

  describe('with venue', () => {
    it('should fetch offers for Contentful GTL playlists', async () => {
      mockServer.universalGet(
        'https://cdn.contentful.com/spaces/contentfulSpaceId/environments/environment/entries',
        contentfulGtlPlaylistSnap
      )

      renderUseGtlPlaylistsQuery({ venue: defaultVenue })

      await waitFor(() =>
        expect(mockFetchOffersByGTL).toHaveBeenCalledWith({
          parameters: expect.arrayContaining([
            expect.objectContaining({
              locationParams: {
                aroundMeRadius: 'all',
                aroundPlaceRadius: 'all',
                selectedLocationMode: 'EVERYWHERE',
                userLocation: null,
              },
              offerParams: expect.objectContaining({
                offerGtlLabel: 'Romance',
                offerGtlLevel: 3,
                venue: {
                  info: 'Jest',
                  isOpenToPublic: true,
                  label: 'Une librairie',
                  venueId: 123,
                },
              }),
            }),
          ]),
          buildLocationParameterParams: {
            aroundMeRadius: 'all',
            aroundPlaceRadius: 'all',
            selectedLocationMode: 'AROUND_ME',
            userLocation: {
              latitude: 48,
              longitude: -1,
            },
          },
          isUserUnderage: false,
          searchIndex: undefined,
        })
      )
    })

    it('should not return playlist that contains no offer', async () => {
      mockServer.universalGet(
        'https://cdn.contentful.com/spaces/contentfulSpaceId/environments/environment/entries',
        contentfulGtlPlaylistSnap
      )

      mockFetchOffersByGTL.mockResolvedValueOnce([])

      const { result } = renderUseGtlPlaylistsQuery({ venue: defaultVenue })

      await waitFor(async () => expect(result.current.isFetched).toEqual(true))

      expect(result.current).toMatchObject({ data: [], isLoading: false, isSuccess: true })
    })

    it('should not return playlist when it is shorter than the minimum number of offers', async () => {
      mockServer.universalGet(
        'https://cdn.contentful.com/spaces/contentfulSpaceId/environments/environment/entries',
        {
          ...contentfulGtlPlaylistSnap,
          includes: {
            ...contentfulGtlPlaylistSnap.includes,
            Entry: [
              {
                ...contentfulGtlPlaylistSnap.includes.Entry[0],
                fields: {
                  ...contentfulGtlPlaylistSnap.includes.Entry[0].fields,
                  minOffers: 2,
                },
              },
            ],
          },
        }
      )

      mockFetchOffersByGTL.mockResolvedValueOnce([
        { ...mockedAlgoliaResponse, hits: [mockedAlgoliaResponse.hits[0]] },
      ])

      const { result } = renderUseGtlPlaylistsQuery({ venue: defaultVenue })

      await waitFor(async () => expect(result.current.isFetched).toEqual(true))

      expect(result.current).toMatchObject({ data: [] })
    })
  })

  describe('without venue', () => {
    it('should fetch offers for Contentful GTL playlists', async () => {
      mockServer.universalGet(
        'https://cdn.contentful.com/spaces/contentfulSpaceId/environments/environment/entries',
        contentfulGtlPlaylistSnap
      )

      renderUseGtlPlaylistsQuery({ venue: defaultVenue })

      await waitFor(() =>
        expect(mockFetchOffersByGTL).toHaveBeenCalledWith({
          buildLocationParameterParams: {
            aroundMeRadius: 'all',
            aroundPlaceRadius: 'all',
            selectedLocationMode: 'AROUND_ME',
            userLocation: { latitude: 48, longitude: -1 },
          },
          isUserUnderage: false,
          parameters: expect.arrayContaining([
            expect.objectContaining({
              offerParams: expect.objectContaining({
                offerGtlLabel: 'Romance',
                offerGtlLevel: 3,
              }),
            }),
            expect.objectContaining({
              offerParams: expect.objectContaining({
                offerGtlLabel: 'Romance',
                offerGtlLevel: 3,
              }),
            }),
          ]),
          searchIndex: undefined,
        })
      )
    })
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

const renderUseGtlPlaylistsQuery = ({
  venue,
  searchGroupLabel,
}: {
  venue?: VenueResponse
  searchGroupLabel?: ContentfulLabelCategories
}) =>
  renderHook(
    () =>
      useGTLPlaylistsQuery({
        venue,
        searchGroupLabel,
        searchIndex: undefined,
        userLocation: { latitude: 48, longitude: -1 },
        selectedLocationMode: LocationMode.AROUND_ME,
        isUserUnderage: false,
        adaptPlaylistParameters: mockAdaptPlaylistParameters,
        queryKey: 'THEMATIC_SEARCH_BOOKS_GTL_PLAYLISTS',
        transformHits,
      }),
    {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    }
  )
