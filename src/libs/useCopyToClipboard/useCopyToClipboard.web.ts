import { useCallback } from 'react'

import { useSnackBarContext, SNACK_BAR_TIME_OUT } from 'ui/components/snackBar/SnackBarContext'

export const useCopyToClipboard = ({
  textToCopy,
  snackBarMessage,
  onCopy,
}: {
  textToCopy: string
  snackBarMessage?: string
  onCopy?: () => void
}) => {
  const { showSuccessSnackBar, showErrorSnackBar } = useSnackBarContext()

  return useCallback(
    async () => {
      try {
        await globalThis.navigator.clipboard.writeText(textToCopy)
        onCopy?.()
        showSuccessSnackBar({
          message: snackBarMessage ?? 'Copié\u00a0!',
          timeout: SNACK_BAR_TIME_OUT,
        })
      } catch {
        showErrorSnackBar({
          message: 'Une erreur est survenue, veuillez réessayer.',
          timeout: SNACK_BAR_TIME_OUT,
        })
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [textToCopy, snackBarMessage, onCopy]
  )
}
