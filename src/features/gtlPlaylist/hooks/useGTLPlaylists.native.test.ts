import { SubcategoriesResponseModelv2, VenueResponse } from 'api/gen'
import { contentfulGtlPlaylistSnap } from 'features/gtlPlaylist/fixtures/contentfulGtlPlaylistSnap'
import { fetchOffersByGTL } from 'libs/algolia/fetchAlgolia/fetchOffersByGTL'
import { mockedAlgoliaResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { LocationMode, Position } from 'libs/location/types'
import { QueryKeys } from 'libs/queryKeys'
import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

import { useGTLPlaylists } from './useGTLPlaylists'

const mockVenue: VenueResponse = {
  name: 'Une librairie',
  city: 'Jest',
  id: 123,
  isVirtual: false,
  accessibility: {},
  timezone: 'Europe/Paris',
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

      renderHookWithParams('VENUE_GTL_PLAYLISTS', mockVenue)

      await waitFor(() => {
        expect(mockFetchOffersByGTL).toHaveBeenCalledWith(
          expect.arrayContaining([
            {
              locationParams: expect.any(Object),
              offerParams: expect.objectContaining({
                offerGtlLabel: 'Jeunesse',
                offerGtlLevel: 1,
                venue: { info: 'Jest', label: 'Une librairie', venueId: 123 },
              }),
            },
          ]),
          expect.any(Object),
          false,
          undefined
        )
      })
    })

    it('should return playlists information', async () => {
      mockServer.universalGet(
        'https://cdn.contentful.com/spaces/contentfulSpaceId/environments/environment/entries',
        contentfulGtlPlaylistSnap
      )

      const { result } = renderHookWithParams('VENUE_GTL_PLAYLISTS', mockVenue)

      await waitFor(() => {
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
    })

    it('should not return playlist that contains no offer', async () => {
      mockServer.universalGet(
        'https://cdn.contentful.com/spaces/contentfulSpaceId/environments/environment/entries',
        contentfulGtlPlaylistSnap
      )

      mockFetchOffersByGTL.mockResolvedValueOnce([])

      const { result } = renderHookWithParams('VENUE_GTL_PLAYLISTS', mockVenue)

      await waitFor(() => {
        expect(result.current).toEqual({ gtlPlaylists: [], isLoading: false })
      })
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

      const { result } = renderHookWithParams('VENUE_GTL_PLAYLISTS', mockVenue)

      await waitFor(() => {
        expect(result.current).toEqual({ gtlPlaylists: [], isLoading: false })
      })
    })
  })

  describe('without venue', () => {
    it('should fetch offers for Contentful GTL playlists', async () => {
      mockServer.universalGet(
        'https://cdn.contentful.com/spaces/contentfulSpaceId/environments/environment/entries',
        contentfulGtlPlaylistSnap
      )

      renderHookWithParams('SEARCH_N1_BOOKS_GTL_PLAYLISTS')

      await waitFor(() => {
        expect(mockFetchOffersByGTL).toHaveBeenCalledWith(
          expect.arrayContaining([
            {
              locationParams: expect.any(Object),
              offerParams: expect.objectContaining({
                offerGtlLabel: 'Jeunesse',
                offerGtlLevel: 1,
              }),
            },
          ]),
          expect.any(Object),
          false,
          undefined
        )
      })
    })

    it('should return empty list if no venue given', async () => {
      const { result } = renderHookWithParams('VENUE_GTL_PLAYLISTS')

      await waitFor(() => {
        expect(result.current).toEqual({ gtlPlaylists: [], isLoading: false })
      })
    })
  })
})

const renderHookWithParams = (queryKey: keyof typeof QueryKeys, venue?: VenueResponse) =>
  renderHook(() => useGTLPlaylists({ queryKey, venue }), {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
