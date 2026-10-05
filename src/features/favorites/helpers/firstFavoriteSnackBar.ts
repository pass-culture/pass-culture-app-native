import { FavoriteType } from 'features/favorites/enum'
import { storage, StorageKey } from 'libs/storage'
import { showSuccessSnackBar } from 'ui/designSystem/Snackbar/snackBar.store'

const getStorageKey = (type: FavoriteType): StorageKey => `${type}_first_favorite`

export const checkIsFirstFavorite = async (type: FavoriteType) => {
  return (await storage.readString(getStorageKey(type))) === 'true'
}

export const markIsFirstFavorite = async (type: FavoriteType) => {
  await storage.saveString(getStorageKey(type), 'true')
}

export const triggerFirstFavoriteSnackBar = async (type: FavoriteType) => {
  const hasBeenMarked = await checkIsFirstFavorite(type)

  if (!hasBeenMarked) {
    showSuccessSnackBar(
      'Retrouve tes offres, tes artistes et tes lieux préférés dans ton onglet favoris.'
    )
    await markIsFirstFavorite(type)
  }
}
