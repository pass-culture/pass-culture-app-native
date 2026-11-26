import React from 'react'

import { availableReactionsSnap } from 'features/bookings/fixtures/availableReactionSnap'
import {
  FavoritesTabViewsProvider,
  useFavoritesTabViews,
} from 'features/favorites/context/FavoritesTabViewsProvider'
import { useTabBarItemIndicators } from 'features/navigation/helpers/useTabBarItemIndicators'
import { storage } from 'libs/storage'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

const mockAvailableReactionsSnap = availableReactionsSnap
let mockOfferFavorites = { favorites: [{ id: 1 }] }
let mockVenueFavorites = { favorites: [{ id: 2 }, { id: 3 }] }
let mockArtistFavorites = { favorites: [] as { id: number }[] }
let mockEnableFavoriteChip = true

jest.mock('features/reactions/queries/useAvailableReactionQuery', () => ({
  useAvailableReactionQuery: jest.fn(() => ({
    data: mockAvailableReactionsSnap,
  })),
}))

jest.mock('features/auth/context/AuthContext', () => ({
  ...jest.requireActual('features/auth/context/AuthContext'),
  useAuthContext: () => ({ isLoggedIn: true }),
}))

jest.mock('queries/favorites/useFavoritesQuery', () => ({
  useOfferFavoritesQuery: () => ({ data: mockOfferFavorites }),
  useVenueFavoritesQuery: () => ({ data: mockVenueFavorites }),
  useArtistFavoritesQuery: () => ({ data: mockArtistFavorites }),
}))

jest.mock('libs/firebase/firestore/featureFlags/useFeatureFlag', () => ({
  useFeatureFlag: (flag: string) => (flag === 'enableFavoriteChip' ? mockEnableFavoriteChip : true),
}))

describe('useTabBarItemIndicators', () => {
  beforeEach(async () => {
    mockOfferFavorites = { favorites: [{ id: 1 }] }
    mockVenueFavorites = { favorites: [{ id: 2 }, { id: 3 }] }
    mockArtistFavorites = { favorites: [] }
    mockEnableFavoriteChip = true
    await Promise.all([
      storage.clear('unviewed_favorite_offer_ids'),
      storage.clear('unviewed_favorite_venue_ids'),
      storage.clear('unviewed_favorite_artist_ids'),
    ])
    await storage.saveObject('unviewed_favorite_venue_ids', [2, 3])
  })

  it('should return numeric badges by route without encoding the favorites chip as a number', () => {
    const { result } = renderHook(() => useTabBarItemIndicators(), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    expect(result.current.badgeValues).toEqual({ Bookings: 2 })
  })

  it('should show the favorites chip when any favorite type has unviewed items', async () => {
    const { result } = renderHook(() => useTabBarItemIndicators(), {
      wrapper: ({ children }) =>
        reactQueryProviderHOC(React.createElement(FavoritesTabViewsProvider, null, children)),
    })

    await waitFor(() => expect(result.current.showFavoritesChip).toBe(true))
  })

  it('should not show the favorites chip when its feature flag is disabled', async () => {
    mockEnableFavoriteChip = false
    const { result } = renderHook(
      () => ({
        indicators: useTabBarItemIndicators(),
        isReady: useFavoritesTabViews().isReady,
      }),
      {
        wrapper: ({ children }) =>
          reactQueryProviderHOC(React.createElement(FavoritesTabViewsProvider, null, children)),
      }
    )

    await waitFor(() => expect(result.current.isReady).toBe(true))

    expect(result.current.indicators.showFavoritesChip).toBe(false)
  })

  it('should keep the chip until all unviewed favorites are removed', async () => {
    const { result, rerender } = renderHook(() => useTabBarItemIndicators(), {
      wrapper: ({ children }) =>
        reactQueryProviderHOC(React.createElement(FavoritesTabViewsProvider, null, children)),
    })

    await waitFor(() => expect(result.current.showFavoritesChip).toBe(true))

    mockVenueFavorites = { favorites: [{ id: 3 }] }
    rerender(undefined)

    expect(result.current.showFavoritesChip).toBe(true)

    mockVenueFavorites = { favorites: [] }
    rerender(undefined)

    await waitFor(() => expect(result.current.showFavoritesChip).toBe(false))
  })
})
