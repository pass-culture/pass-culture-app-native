import { SearchResponse } from '@algolia/client-search'

import { SubcategoryIdEnum, VenueResponse } from 'api/gen'
import { LocationMode, Position } from 'libs/location/types'
import { Offer } from 'shared/offer/types'
import { toMutable } from 'shared/types/toMutable'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook } from 'tests/utils'

import * as useGTLPlaylistsLibrary from '../api/gtlPlaylistApi'

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

const gtlPlaylistsFixture = toMutable([
  {
    title: 'Test',
    offers: {
      hits: [
        {
          offer: {
            name: 'Test',
            subcategoryId: SubcategoryIdEnum.ABO_BIBLIOTHEQUE,
          },
          venue: {
            address: 'Avenue des Tests',
            city: 'Jest',
          },
          _geoloc: {
            lat: 2,
            lng: 2,
          },
          objectID: '12',
        },
      ],
    } as SearchResponse<Offer>,
    layout: 'one-item-medium' as const,
    minNumberOfOffers: 1,
    entryId: '2xUlLBRfxdk6jeYyJszunX',
  },
] as const)

const mockFetchGTLPlaylists = jest
  .spyOn(useGTLPlaylistsLibrary, 'fetchGTLPlaylists')
  .mockResolvedValue(gtlPlaylistsFixture)

describe('useGTLPlaylists', () => {
  const renderHookWithParams = () =>
    renderHook(() => useGTLPlaylists({ venue }), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

  it('should not fetch if no venue given', async () => {
    renderHook(() => useGTLPlaylists({ venue: undefined }), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    expect(useGTLPlaylistsLibrary.fetchGTLPlaylists).not.toHaveBeenCalled()
  })

  it('should fetch GTL playlists', async () => {
    const { rerender, result } = renderHookWithParams()

    expect(result.current).toEqual({ gtlPlaylists: [], isLoading: true })

    expect(useGTLPlaylistsLibrary.fetchGTLPlaylists).toHaveBeenNthCalledWith(1, {
      buildLocationParameterParams: {
        userLocation: {
          latitude: 2,
          longitude: 2,
        },
        selectedLocationMode: LocationMode.AROUND_ME,
        aroundMeRadius: 'all',
        aroundPlaceRadius: 'all',
      },
      isUserUnderage: false,

      venue: { name: 'Une librairie', city: 'Jest', id: 123, accessibility: {}, isVirtual: false },
    })

    await act(async () => {
      rerender(undefined)
    })
  })

  it('should return playlists information', async () => {
    const { result } = renderHookWithParams()

    await act(async () => {})

    expect(result.current).toEqual({
      gtlPlaylists: [
        {
          layout: 'one-item-medium',
          minNumberOfOffers: 1,
          offers: {
            hits: [
              {
                _geoloc: {
                  lat: 2,
                  lng: 2,
                },
                objectID: '12',
                offer: {
                  name: 'Test',
                  subcategoryId: 'ABO_BIBLIOTHEQUE',
                },
                venue: {
                  address: 'Avenue des Tests',
                  city: 'Jest',
                },
              },
            ],
          },
          title: 'Test',
          entryId: '2xUlLBRfxdk6jeYyJszunX',
        },
      ],
      isLoading: false,
    })
  })

  it('should not return playlist that contains no offer', async () => {
    mockFetchGTLPlaylists.mockResolvedValueOnce([
      {
        title: 'Test',
        offers: {
          hits: [],
        } as unknown as SearchResponse<Offer>,
        layout: 'one-item-medium',
        minNumberOfOffers: 0,
        entryId: '2xUlLBRfxdk6jeYyJszunX',
      },
    ])

    const { result } = renderHookWithParams()

    await act(async () => {})

    expect(result.current).toEqual({ gtlPlaylists: [], isLoading: false })
  })

  it('should not return playlist when it is shorter than the minimum number of offers', async () => {
    mockFetchGTLPlaylists.mockResolvedValueOnce([
      { ...gtlPlaylistsFixture[0], minNumberOfOffers: 2 },
    ])

    const { result } = renderHookWithParams()

    await act(async () => {})

    expect(result.current).toEqual({ gtlPlaylists: [], isLoading: false })
  })
})
