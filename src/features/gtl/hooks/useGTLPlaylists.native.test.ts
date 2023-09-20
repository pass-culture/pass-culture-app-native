import { SearchResponse } from '@algolia/client-search'

import { Offer } from 'shared/offer/types'
import { flushAllPromisesWithAct, renderHook } from 'tests/utils'

import * as useGTLPlaylistsLibrary from '../api/gtl-playlist-api'

import { useGTLPlaylists } from './useGTLPlaylists'

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
      hits: [],
    } as unknown as SearchResponse<Offer>,
    layout: 'one-item-medium',
  },
])

describe('useGTLPlaylists', () => {
  it('should return correct data based on fetch api return', async () => {
    const { result } = renderHook(useGTLPlaylists)

    expect(result.current).toEqual([])

    await flushAllPromisesWithAct()

    expect(result.current).toEqual([
      {
        title: 'Test',
        offers: {
          hits: [],
        },
        layout: 'one-item-medium',
      },
    ])

    expect(useGTLPlaylistsLibrary.fetchGTLPlaylists).toHaveBeenNthCalledWith(1, {
      isUserUnderage: false,
      position: {
        latitude: 2,
        longitude: 2,
      },
    })
  })
})
