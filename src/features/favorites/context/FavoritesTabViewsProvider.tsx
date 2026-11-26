import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { FavoriteType } from 'features/favorites/enum'
import { StorageKey, storage } from 'libs/storage'

type UnviewedFavorites = Record<FavoriteType, number[]>

type FavoriteUpdate =
  | { type: 'viewed' }
  | { type: 'added'; favoriteId: number }
  | { type: 'removed'; favoriteId: number }

type FavoritesTabViewsContextValue = {
  isReady: boolean
  unviewedFavorites: UnviewedFavorites
  markFavoritesViewed: (type: FavoriteType) => void
  markFavoriteUnviewed: (type: FavoriteType, favoriteId: number) => void
  removeUnviewedFavorite: (type: FavoriteType, favoriteId: number) => void
}

const STORAGE_KEYS: Record<FavoriteType, StorageKey> = {
  [FavoriteType.OFFER]: 'unviewed_favorite_offer_ids',
  [FavoriteType.VENUE]: 'unviewed_favorite_venue_ids',
  [FavoriteType.ARTIST]: 'unviewed_favorite_artist_ids',
}

const FAVORITE_TYPES = [FavoriteType.OFFER, FavoriteType.VENUE, FavoriteType.ARTIST]

const emptyUnviewedFavorites: UnviewedFavorites = {
  [FavoriteType.OFFER]: [],
  [FavoriteType.VENUE]: [],
  [FavoriteType.ARTIST]: [],
}

const FavoritesTabViewsContext = createContext<FavoritesTabViewsContextValue>({
  isReady: false,
  unviewedFavorites: emptyUnviewedFavorites,
  markFavoritesViewed: () => undefined,
  markFavoriteUnviewed: () => undefined,
  removeUnviewedFavorite: () => undefined,
})

const readStoredFavoriteIds = async (type: FavoriteType): Promise<number[]> => {
  const favoriteIds = await storage.readObject<number[]>(STORAGE_KEYS[type])
  return Array.isArray(favoriteIds)
    ? favoriteIds.filter(
        (favoriteId) => typeof favoriteId === 'number' && Number.isFinite(favoriteId)
      )
    : []
}

const readUnviewedFavorites = async (): Promise<UnviewedFavorites> => {
  const [offers, venues, artists] = await Promise.all([
    readStoredFavoriteIds(FavoriteType.OFFER),
    readStoredFavoriteIds(FavoriteType.VENUE),
    readStoredFavoriteIds(FavoriteType.ARTIST),
  ])

  return {
    [FavoriteType.OFFER]: offers,
    [FavoriteType.VENUE]: venues,
    [FavoriteType.ARTIST]: artists,
  }
}

const applyFavoriteUpdate = (favoriteIds: number[], update: FavoriteUpdate): number[] => {
  switch (update.type) {
    case 'viewed':
      return favoriteIds.length ? [] : favoriteIds
    case 'added':
      return favoriteIds.includes(update.favoriteId)
        ? favoriteIds
        : [...favoriteIds, update.favoriteId]
    case 'removed':
      return favoriteIds.includes(update.favoriteId)
        ? favoriteIds.filter((favoriteId) => favoriteId !== update.favoriteId)
        : favoriteIds
  }
}

const applyFavoriteUpdates = (favoriteIds: number[], updates: FavoriteUpdate[]): number[] =>
  updates.reduce(applyFavoriteUpdate, favoriteIds)

export const FavoritesTabViewsProvider = ({ children }: PropsWithChildren) => {
  const [unviewedFavorites, setUnviewedFavorites] = useState(emptyUnviewedFavorites)
  const [isReady, setIsReady] = useState(false)
  const unviewedFavoritesRef = useRef(unviewedFavorites)
  const pendingUpdatesRef = useRef<Partial<Record<FavoriteType, FavoriteUpdate[]>>>({})

  useEffect(function initializeUnviewedFavorites() {
    let isMounted = true
    void readUnviewedFavorites().then((storedUnviewedFavorites) => {
      if (!isMounted) return
      const pendingUpdates = pendingUpdatesRef.current
      const initialUnviewedFavorites = {
        [FavoriteType.OFFER]: applyFavoriteUpdates(
          storedUnviewedFavorites[FavoriteType.OFFER],
          pendingUpdates[FavoriteType.OFFER] ?? []
        ),
        [FavoriteType.VENUE]: applyFavoriteUpdates(
          storedUnviewedFavorites[FavoriteType.VENUE],
          pendingUpdates[FavoriteType.VENUE] ?? []
        ),
        [FavoriteType.ARTIST]: applyFavoriteUpdates(
          storedUnviewedFavorites[FavoriteType.ARTIST],
          pendingUpdates[FavoriteType.ARTIST] ?? []
        ),
      }
      pendingUpdatesRef.current = {}
      unviewedFavoritesRef.current = initialUnviewedFavorites
      setUnviewedFavorites(initialUnviewedFavorites)
      setIsReady(true)

      FAVORITE_TYPES.forEach((type) => {
        if (pendingUpdates[type]?.length) {
          void storage.saveObject(STORAGE_KEYS[type], initialUnviewedFavorites[type])
        }
      })
    })

    return () => {
      isMounted = false
    }
  }, [])

  const updateUnviewedFavorites = useCallback(
    (type: FavoriteType, update: FavoriteUpdate) => {
      const currentFavoriteIds = unviewedFavoritesRef.current[type]
      const nextFavoriteIds = applyFavoriteUpdate(currentFavoriteIds, update)
      const hasChanged = nextFavoriteIds !== currentFavoriteIds
      const nextUnviewedFavorites = {
        ...unviewedFavoritesRef.current,
        [type]: nextFavoriteIds,
      }
      if (hasChanged) {
        unviewedFavoritesRef.current = nextUnviewedFavorites
        setUnviewedFavorites(nextUnviewedFavorites)
      }

      if (isReady) {
        if (hasChanged) void storage.saveObject(STORAGE_KEYS[type], nextUnviewedFavorites[type])
      } else {
        pendingUpdatesRef.current[type] = [...(pendingUpdatesRef.current[type] ?? []), update]
      }
    },
    [isReady]
  )

  const markFavoritesViewed = useCallback(
    (type: FavoriteType) => updateUnviewedFavorites(type, { type: 'viewed' }),
    [updateUnviewedFavorites]
  )

  const markFavoriteUnviewed = useCallback(
    (type: FavoriteType, favoriteId: number) =>
      updateUnviewedFavorites(type, { type: 'added', favoriteId }),
    [updateUnviewedFavorites]
  )

  const removeUnviewedFavorite = useCallback(
    (type: FavoriteType, favoriteId: number) =>
      updateUnviewedFavorites(type, { type: 'removed', favoriteId }),
    [updateUnviewedFavorites]
  )

  const contextValue = useMemo(
    () => ({
      isReady,
      unviewedFavorites,
      markFavoritesViewed,
      markFavoriteUnviewed,
      removeUnviewedFavorite,
    }),
    [isReady, unviewedFavorites, markFavoritesViewed, markFavoriteUnviewed, removeUnviewedFavorite]
  )

  return (
    <FavoritesTabViewsContext.Provider value={contextValue}>
      {children}
    </FavoritesTabViewsContext.Provider>
  )
}

export const useFavoritesTabViews = () => useContext(FavoritesTabViewsContext)
