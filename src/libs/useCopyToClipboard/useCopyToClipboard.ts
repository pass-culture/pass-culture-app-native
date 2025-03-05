import Clipboard from '@react-native-clipboard/clipboard'
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

  return useCallback(async () => {
    Clipboard.setString(textToCopy)
    if ((await Clipboard.getString()) === textToCopy) {
      onCopy?.()
      showSuccessSnackBar({
        message: snackBarMessage ?? 'Copié\u00a0!',
        timeout: SNACK_BAR_TIME_OUT,
      })
    } else {
      showErrorSnackBar({
        message: 'Une erreur est survenue, veuillez réessayer.',
        timeout: SNACK_BAR_TIME_OUT,
      })
    }
  }, [textToCopy, onCopy, showSuccessSnackBar, snackBarMessage, showErrorSnackBar])
}
