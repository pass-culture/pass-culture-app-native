import { ApiError } from 'api/ApiError'
import * as snackBarStoreModule from 'ui/designSystem/Snackbar/snackBar.store'

import { handleFavoriteError } from './handleFavoriteError'

const mockShowErrorSnackBar = jest.spyOn(snackBarStoreModule, 'showErrorSnackBar')

describe('handleFavoriteError', () => {
  const fallbackMessage = 'Une erreur est survenue lors de la modification des favoris'

  it('should display max favorites reached message when error is an ApiError with MAX_FAVORITES_REACHED code', () => {
    const error = new ApiError(400, { code: 'MAX_FAVORITES_REACHED' })

    handleFavoriteError(error, fallbackMessage)

    expect(mockShowErrorSnackBar).toHaveBeenNthCalledWith(
      1,
      'Trop de favoris enregistrés. Supprime des favoris pour en ajouter de nouveaux.'
    )
  })

  it('should display fallback message when error is an ApiError with a different code', () => {
    const error = new ApiError(400, { code: 'INTERNAL_SERVER_ERROR' })

    handleFavoriteError(error, fallbackMessage)

    expect(mockShowErrorSnackBar).toHaveBeenNthCalledWith(1, fallbackMessage)
  })

  it('should display fallback message when error is a standard Error', () => {
    const error = new Error('Network error')

    handleFavoriteError(error, fallbackMessage)

    expect(mockShowErrorSnackBar).toHaveBeenNthCalledWith(1, fallbackMessage)
  })
})
