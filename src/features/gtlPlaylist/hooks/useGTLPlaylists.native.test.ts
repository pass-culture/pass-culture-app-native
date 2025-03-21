import { SubcategoriesResponseModelv2, VenueResponse, VenueTypeCodeKey } from 'api/gen'
import { contentfulGtlPlaylistSnap } from 'features/gtlPlaylist/fixtures/contentfulGtlPlaylistSnap'
import { fetchOffersByGTL } from 'libs/algolia/fetchAlgolia/fetchOffersByGTL'
import { mockedAlgoliaResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { ContentfulLabelCategories } from 'libs/contentful/types'
import { LocationMode, Position } from 'libs/location/types'
import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook } from 'tests/utils'

jest.mock('libs/network/NetInfoWrapper')

import { useGTLPlaylists } from './useGTLPlaylists'

const defaultVenue: VenueResponse = {
  name: 'Une librairie',
  city: 'Jest',
  id: 123,
  isVirtual: false,
  accessibility: {},
  timezone: 'Europe/Paris',
  venueTypeCode: VenueTypeCodeKey.DISTRIBUTION_STORE,
}

const mockVenue = (venueTypeCode: VenueTypeCodeKey) => ({ ...defaultVenue, venueTypeCode })
const bookstoreVenue = mockVenue(VenueTypeCodeKey.BOOKSTORE)
const distributionStoreVenue = mockVenue(VenueTypeCodeKey.DISTRIBUTION_STORE)
const recordStoreVenue = mockVenue(VenueTypeCodeKey.RECORD_STORE)
const culturalCentreVenue = mockVenue(VenueTypeCodeKey.CULTURAL_CENTRE)

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

describe('useGTLPlaylists', () => {
  beforeEach(() => {
    mockServer.getApi<SubcategoriesResponseModelv2>('/v1/subcategories/v2', subcategoriesDataTest)
  })

  describe('with venue', () => {
    it('should fetch offers for Contentful GTL playlists', async () => {
      mockServer.universalGet(
        'https://cdn.contentful.com/spaces/contentfulSpaceId/environments/environment/entries',
        contentfulGtlPlaylistSnap
      )

      renderUseGtlPlaylists({ venue: defaultVenue })

      await act(async () => {})

      expect(mockFetchOffersByGTL).toHaveBeenCalledWith({
        parameters: expect.arrayContaining([
          {
            locationParams: expect.any(Object),
            offerParams: expect.objectContaining({
              offerGtlLabel: 'Jeunesse',
              offerGtlLevel: 1,
              venue: { info: 'Jest', label: 'Une librairie', venueId: 123 },
            }),
          },
        ]),
        buildLocationParameterParams: expect.any(Object),
        isUserUnderage: false,
        searchIndex: undefined,
      })
    })

    it('should return playlists information', async () => {
      mockServer.universalGet(
        'https://cdn.contentful.com/spaces/contentfulSpaceId/environments/environment/entries',
        contentfulGtlPlaylistSnap
      )

      const { result } = renderUseGtlPlaylists({ venue: defaultVenue })

      await act(async () => {})

      expect(result.current).toEqual({
        gtlPlaylists: [
          {
            layout: 'two-items',
            minNumberOfOffers: 1,
            offers: expect.objectContaining({
              hits: expect.any(Array),
            }),
            title: 'Jeunesse',
            entryId: '7FqRezKdV0mcUjOYerCUuJ',
          },
        ],
        isLoading: false,
      })
    })

    it('should not return playlist that contains no offer', async () => {
      mockServer.universalGet(
        'https://cdn.contentful.com/spaces/contentfulSpaceId/environments/environment/entries',
        contentfulGtlPlaylistSnap
      )

      mockFetchOffersByGTL.mockResolvedValueOnce([])

      const { result } = renderUseGtlPlaylists({ venue: defaultVenue })

      await act(async () => {})

      expect(result.current).toEqual({ gtlPlaylists: [], isLoading: false })
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

      const { result } = renderUseGtlPlaylists({ venue: defaultVenue })

      await act(async () => {})

      expect(result.current).toEqual({ gtlPlaylists: [], isLoading: false })
    })

    it.each`
      venue                     | expectedNbOfCalls | expectedBehavior
      ${bookstoreVenue}         | ${1}              | ${'should fetch'}
      ${distributionStoreVenue} | ${1}              | ${'should fetch'}
      ${recordStoreVenue}       | ${1}              | ${'should fetch'}
      ${culturalCentreVenue}    | ${0}              | ${'should not fetch'}
    `(
      '$expectedBehavior gtl playlist when venueType is $venue.venueTypeCode',
      async ({ venue, expectedNbOfCalls }) => {
        mockServer.universalGet(
          'https://cdn.contentful.com/spaces/contentfulSpaceId/environments/environment/entries',
          contentfulGtlPlaylistSnap
        )

        renderUseGtlPlaylists({ venue })

        await act(async () => {})

        expect(mockFetchOffersByGTL).toHaveBeenCalledTimes(expectedNbOfCalls)
      }
    )
  })

  describe('without venue', () => {
    it('should fetch offers for Contentful GTL playlists', async () => {
      mockServer.universalGet(
        'https://cdn.contentful.com/spaces/contentfulSpaceId/environments/environment/entries',
        contentfulGtlPlaylistSnap
      )

      renderUseGtlPlaylists({})

      await act(async () => {})

      expect(mockFetchOffersByGTL).toHaveBeenCalledWith({
        buildLocationParameterParams: {
          aroundMeRadius: 'all',
          aroundPlaceRadius: 'all',
          selectedLocationMode: 'AROUND_ME',
          userLocation: { latitude: 2, longitude: 2 },
        },
        isUserUnderage: false,
        parameters: expect.arrayContaining([
          expect.objectContaining({
            offerParams: expect.objectContaining({
              offerGtlLabel: 'Jeunesse',
              offerGtlLevel: 1,
            }),
          }),
          expect.objectContaining({
            offerParams: expect.objectContaining({
              offerGtlLabel: 'Jeunesse',
              offerGtlLevel: 1,
            }),
          }),
        ]),
        searchIndex: undefined,
      })
    })

    it.each`
      searchGroupLabel | expectedNbOfCalls
      ${'Livres'}      | ${1}
      ${'Musique'}     | ${1}
    `(
      'should fetch gtl playlists when searchGroupLabel is $searchGroupLabel',
      async ({ searchGroupLabel, expectedNbOfCalls }) => {
        mockServer.universalGet(
          'https://cdn.contentful.com/spaces/contentfulSpaceId/environments/environment/entries',
          contentfulGtlPlaylistSnap
        )

        renderUseGtlPlaylists({ searchGroupLabel })

        await act(async () => {})

        expect(mockFetchOffersByGTL).toHaveBeenCalledTimes(expectedNbOfCalls)
      }
    )
  })
})

const renderUseGtlPlaylists = ({
  venue,
  searchGroupLabel,
}: {
  venue?: VenueResponse
  searchGroupLabel?: ContentfulLabelCategories
}) =>
  renderHook(() => useGTLPlaylists({ venue, searchGroupLabel }), {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
