import { SearchResponse } from '@algolia/client-search'

import { SubcategoryIdEnum, VenueResponse } from 'api/gen'
import { Offer } from 'shared/offer/types'
import { act, renderHook } from 'tests/utils'

import * as useGTLPlaylistsLibrary from '../api/gtlPlaylistApi'

import { useGTLPlaylists } from './useGTLPlaylists'

const venue = { name: 'Une librairie', city: 'Jest', id: 123 } as VenueResponse

jest.mock('features/home/helpers/useHomePosition', () => ({
  useHomePosition: jest.fn().mockReturnValue({
    position: {
      latitude: 2,
      longitude: 2,
    },
  }),
}))

jest.mock('features/profile/helpers/useIsUserUnderage', () => ({
  useIsUserUnderage: jest.fn().mockReturnValue(false),
}))

jest.spyOn(useGTLPlaylistsLibrary, 'fetchGTLPlaylists').mockResolvedValue([
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
    layout: 'one-item-medium',
    entryId: '2xUlLBRfxdk6jeYyJszunX',
  },
])

describe('useGTLPlaylists', () => {
  const renderHookWithParams = () => renderHook(() => useGTLPlaylists({ venue }))

  it('should not fetch if no venue given', async () => {
    renderHook(() => useGTLPlaylists({ venue: undefined }))

    expect(useGTLPlaylistsLibrary.fetchGTLPlaylists).not.toHaveBeenCalled()
  })

  it('should fetch GTL playlists', async () => {
    const { rerender, result } = renderHookWithParams()

    expect(result.current).toEqual([])

    expect(useGTLPlaylistsLibrary.fetchGTLPlaylists).toHaveBeenNthCalledWith(1, {
      isUserUnderage: false,
      position: {
        latitude: 2,
        longitude: 2,
      },
      venue: { name: 'Une librairie', city: 'Jest', id: 123 },
    })

    await act(async () => {
      rerender(undefined)
    })
  })

  it('should return playlists information', async () => {
    const { result } = renderHookWithParams()

    await act(async () => {})

    expect(result.current).toEqual([
      {
        layout: 'one-item-medium',
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
    ])
  })

  it('should not return playlist that contains no offer', async () => {
    jest.spyOn(useGTLPlaylistsLibrary, 'fetchGTLPlaylists').mockResolvedValueOnce([
      {
        title: 'Test',
        offers: {
          hits: [],
        } as unknown as SearchResponse<Offer>,
        layout: 'one-item-medium',
        entryId: '2xUlLBRfxdk6jeYyJszunX',
      },
    ])

    const { result } = renderHookWithParams()

    await act(async () => {})

    expect(result.current).toEqual([])
  })
})
