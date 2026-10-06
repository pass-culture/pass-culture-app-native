import { FavoriteType } from 'features/favorites/enum'
import {
  checkIsFirstFavorite,
  markIsFirstFavorite,
  triggerFirstFavoriteSnackBar,
} from 'features/favorites/helpers/firstFavoriteSnackBar'
import { storage } from 'libs/storage'
import * as SnackBarStore from 'ui/designSystem/Snackbar/snackBar.store'

const mockShowSuccessSnackBar = jest.spyOn(SnackBarStore, 'showSuccessSnackBar')
const mockStorageReadString = jest.spyOn(storage, 'readString')
const mockStorageSaveString = jest.spyOn(storage, 'saveString')

describe('firstFavoriteSnackBar', () => {
  describe('checkIsFirstFavorite', () => {
    it('should return true if value in storage is "true"', async () => {
      mockStorageReadString.mockResolvedValueOnce('true')

      const result = await checkIsFirstFavorite(FavoriteType.OFFER)

      expect(mockStorageReadString).toHaveBeenCalledWith('offer_first_favorite')
      expect(result).toEqual(true)
    })

    it('should return false if value in storage is not "true"', async () => {
      mockStorageReadString.mockResolvedValueOnce(null)

      const result = await checkIsFirstFavorite(FavoriteType.OFFER)

      expect(mockStorageReadString).toHaveBeenCalledWith('offer_first_favorite')
      expect(result).toEqual(false)
    })
  })

  describe('markIsFirstFavorite', () => {
    it('should save "true" in storage with the correct key', async () => {
      await markIsFirstFavorite(FavoriteType.OFFER)

      expect(mockStorageSaveString).toHaveBeenCalledWith('offer_first_favorite', 'true')
    })
  })

  describe('triggerFirstFavoriteSnackBar', () => {
    it('should show snackbar and mark as first favorite if it has not been marked yet', async () => {
      mockStorageReadString.mockResolvedValueOnce(null)

      await triggerFirstFavoriteSnackBar(FavoriteType.OFFER)

      expect(mockShowSuccessSnackBar).toHaveBeenCalledWith(
        'Retrouve tes offres, tes artistes et tes lieux préférés dans ton onglet favoris.'
      )
      expect(mockStorageSaveString).toHaveBeenCalledWith('offer_first_favorite', 'true')
    })

    it('should not show snackbar nor save in storage if it has already been marked', async () => {
      jest.spyOn(storage, 'readString').mockResolvedValueOnce('true')

      await triggerFirstFavoriteSnackBar(FavoriteType.OFFER)

      expect(mockShowSuccessSnackBar).not.toHaveBeenCalled()
      expect(mockStorageSaveString).not.toHaveBeenCalled()
    })
  })
})
