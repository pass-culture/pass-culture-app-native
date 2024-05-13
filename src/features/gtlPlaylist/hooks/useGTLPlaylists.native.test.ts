import { VenueResponse } from 'api/gen'
import { contentfulGtlPlaylistSnap } from 'features/gtlPlaylist/fixtures/contentfulGtlPlaylistSnap'
import { fetchOffersByGTL } from 'libs/algolia/fetchAlgolia/fetchOffersByGTL'
import { mockedAlgoliaResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { LocationMode, Position } from 'libs/location/types'
import { placeholderData as subcategoriesFixture } from 'libs/subcategories/placeholderData'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

import { useGTLPlaylists } from './useGTLPlaylists'

const venue: VenueResponse = {
  name: 'Une librairie',
  city: 'Jest',
  id: 123,
  isVirtual: false,
  accessibility: {},
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
  const renderHookWithParams = () =>
    renderHook(() => useGTLPlaylists({ venue }), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

  it('should return empty list if no venue given', async () => {
    mockServer.getApi('/v1/subcategories/v2', subcategoriesFixture)

    const { result } = renderHook(() => useGTLPlaylists({ venue: undefined }), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await waitFor(() => {
      expect(result.current).toEqual({ gtlPlaylists: [], isLoading: false })
    })
  })

  it('should fetch offers for Contentful GTL playlists', async () => {
    mockServer.getApi('/v1/subcategories/v2', subcategoriesFixture)
    mockServer.universalGet(
      'https://cdn.contentful.com/spaces/contentfulSpaceId/environments/environment/entries',
      contentfulGtlPlaylistSnap
    )

    renderHookWithParams()

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
        false
      )
    })
  })

  it('should return playlists information', async () => {
    mockServer.getApi('/v1/subcategories/v2', subcategoriesFixture)
    mockServer.universalGet(
      'https://cdn.contentful.com/spaces/contentfulSpaceId/environments/environment/entries',
      contentfulGtlPlaylistSnap
    )

    const { result } = renderHookWithParams()

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
    mockServer.getApi('/v1/subcategories/v2', subcategoriesFixture)
    mockServer.universalGet(
      'https://cdn.contentful.com/spaces/contentfulSpaceId/environments/environment/entries',
      contentfulGtlPlaylistSnap
    )

    mockFetchOffersByGTL.mockResolvedValueOnce([])

    const { result } = renderHookWithParams()

    await waitFor(() => {
      expect(result.current).toEqual({ gtlPlaylists: [], isLoading: false })
    })
  })

  it('should not return playlist when it is shorter than the minimum number of offers', async () => {
    mockServer.getApi('/v1/subcategories/v2', subcategoriesFixture)
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

    const { result } = renderHookWithParams()

    await waitFor(() => {
      expect(result.current).toEqual({ gtlPlaylists: [], isLoading: false })
    })
  })
})
