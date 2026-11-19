import { ApiError } from 'api/ApiError'
import { isApiError } from 'api/apiHelpers'
import { showErrorSnackBar } from 'ui/designSystem/Snackbar/snackBar.store'

export const handleFavoriteError = (error: Error | ApiError, fallbackMessage: string) => {
  const isMaxReached = isApiError(error) && error.content?.code === 'MAX_FAVORITES_REACHED'

  showErrorSnackBar(
    isMaxReached
      ? 'Trop de favoris enregistrés. Supprime des favoris pour en ajouter de nouveaux.'
      : fallbackMessage
  )
}
