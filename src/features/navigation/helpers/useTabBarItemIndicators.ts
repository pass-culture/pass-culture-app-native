import { useMemo } from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { useFavoritesTabViews } from 'features/favorites/context/FavoritesTabViewsProvider'
import { FavoriteType } from 'features/favorites/enum'
import { useAvailableReactionQuery } from 'features/reactions/queries/useAvailableReactionQuery'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import {
  useArtistFavoritesQuery,
  useOfferFavoritesQuery,
  useVenueFavoritesQuery,
} from 'queries/favorites/useFavoritesQuery'

export type TabBarItemIndicators = {
  badgeValues: { Bookings?: number }
  showFavoritesChip: boolean
}

export const useTabBarItemIndicators = (): TabBarItemIndicators => {
  const { data: availableReactions } = useAvailableReactionQuery()
  const { isLoggedIn } = useAuthContext()
  const enableFavoriteChip = useFeatureFlag(RemoteStoreFeatureFlags.ENABLE_FAVORITE_CHIP)
  const enableFavoritesHub = useFeatureFlag(RemoteStoreFeatureFlags.WIP_FAVORITES_HUB)
  const { isReady, unviewedFavorites } = useFavoritesTabViews()
  const { data: offerFavorites } = useOfferFavoritesQuery({ enabled: enableFavoriteChip })
  const { data: venueFavorites } = useVenueFavoritesQuery({
    enabled: enableFavoritesHub && enableFavoriteChip,
  })
  const { data: artistFavorites } = useArtistFavoritesQuery({
    enabled: enableFavoritesHub && enableFavoriteChip,
  })
  const numberOfReactableBookings = availableReactions?.numberOfReactableBookings

  const hasUnviewedOffers =
    offerFavorites?.favorites.some(({ id }) =>
      unviewedFavorites[FavoriteType.OFFER].includes(id)
    ) ?? false
  const hasUnviewedVenues =
    venueFavorites?.favorites.some(({ id }) =>
      unviewedFavorites[FavoriteType.VENUE].includes(id)
    ) ?? false
  const hasUnviewedArtists =
    artistFavorites?.favorites.some(({ id }) =>
      unviewedFavorites[FavoriteType.ARTIST].includes(id)
    ) ?? false

  const hasUnviewedFavorites =
    enableFavoriteChip &&
    isLoggedIn &&
    isReady &&
    (hasUnviewedOffers || (enableFavoritesHub && (hasUnviewedVenues || hasUnviewedArtists)))

  return useMemo(
    () => ({
      badgeValues: { Bookings: numberOfReactableBookings },
      showFavoritesChip: hasUnviewedFavorites,
    }),
    [numberOfReactableBookings, hasUnviewedFavorites]
  )
}
