import { FavoriteType } from 'features/favorites/enum'
import { storage } from 'libs/storage'
import { act, renderHook, waitFor } from 'tests/utils'

import { FavoritesTabViewsProvider, useFavoritesTabViews } from './FavoritesTabViewsProvider'

describe('FavoritesTabViewsProvider', () => {
  beforeEach(async () => {
    await Promise.all([
      storage.clear('unviewed_favorite_offer_ids'),
      storage.clear('unviewed_favorite_venue_ids'),
      storage.clear('unviewed_favorite_artist_ids'),
    ])
  })

  it('should restore unviewed favorite IDs from local storage', async () => {
    await storage.saveObject('unviewed_favorite_offer_ids', [1, 2])
    await storage.saveObject('unviewed_favorite_venue_ids', [3])

    const { result } = renderHook(() => useFavoritesTabViews(), {
      wrapper: FavoritesTabViewsProvider,
    })

    await waitFor(() => expect(result.current.isReady).toBe(true))

    expect(result.current.unviewedFavorites).toEqual({
      [FavoriteType.OFFER]: [1, 2],
      [FavoriteType.VENUE]: [3],
      [FavoriteType.ARTIST]: [],
    })
  })

  it('should clear unviewed favorites when their tab is opened', async () => {
    await storage.saveObject('unviewed_favorite_offer_ids', [1, 2])

    const { result } = renderHook(() => useFavoritesTabViews(), {
      wrapper: FavoritesTabViewsProvider,
    })

    await waitFor(() => expect(result.current.isReady).toBe(true))

    act(() => result.current.markFavoritesViewed(FavoriteType.OFFER))

    await waitFor(async () => {
      expect(result.current.unviewedFavorites[FavoriteType.OFFER]).toEqual([])
      expect(await storage.readObject('unviewed_favorite_offer_ids')).toEqual([])
    })
  })

  it('should add and remove only the matching unviewed favorite ID', async () => {
    await storage.saveObject('unviewed_favorite_artist_ids', [10, 11])

    const { result } = renderHook(() => useFavoritesTabViews(), {
      wrapper: FavoritesTabViewsProvider,
    })

    await waitFor(() => expect(result.current.isReady).toBe(true))

    act(() => result.current.removeUnviewedFavorite(FavoriteType.ARTIST, 10))

    await waitFor(async () => {
      expect(result.current.unviewedFavorites[FavoriteType.ARTIST]).toEqual([11])
      expect(await storage.readObject('unviewed_favorite_artist_ids')).toEqual([11])
    })

    act(() => result.current.markFavoriteUnviewed(FavoriteType.ARTIST, 12))

    await waitFor(async () => {
      expect(result.current.unviewedFavorites[FavoriteType.ARTIST]).toEqual([11, 12])
      expect(await storage.readObject('unviewed_favorite_artist_ids')).toEqual([11, 12])
    })
  })

  it('should apply updates made while storage is initializing', async () => {
    await storage.saveObject('unviewed_favorite_artist_ids', [10])

    const { result } = renderHook(() => useFavoritesTabViews(), {
      wrapper: FavoritesTabViewsProvider,
    })

    act(() => result.current.markFavoriteUnviewed(FavoriteType.ARTIST, 11))

    await waitFor(async () => {
      expect(result.current.isReady).toBe(true)
      expect(result.current.unviewedFavorites[FavoriteType.ARTIST]).toEqual([10, 11])
      expect(await storage.readObject('unviewed_favorite_artist_ids')).toEqual([10, 11])
    })
  })
})
