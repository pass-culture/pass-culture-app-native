import { SearchResponse } from '@algolia/client-search'

import { Offer } from 'shared/offer/types'
import { renderHook, waitFor } from 'tests/utils'

import * as useGTLPlaylistsLibrary from '../api/gtlPlaylistApi'

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
  it('should fetch GTL playlists', async () => {
    renderHook(useGTLPlaylists)

    await waitFor(() => {
      expect(useGTLPlaylistsLibrary.fetchGTLPlaylists).toHaveBeenNthCalledWith(1, {
        isUserUnderage: false,
        position: {
          latitude: 2,
          longitude: 2,
        },
      })
    })
  })

  it('should return playlists information', async () => {
    const { result } = renderHook(useGTLPlaylists)

    await waitFor(() => {
      expect(result.current).toEqual([
        {
          title: 'Test',
          offers: {
            hits: [],
          },
          layout: 'one-item-medium',
        },
      ])
    })
  })
})
