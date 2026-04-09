import { CopyToClipboardFunction } from 'libs/copyToClipboard/copyToClipboard.types'
import { showErrorSnackBar, showSuccessSnackBar } from 'ui/designSystem/Snackbar/snackBar.store'

export const copyToClipboard: CopyToClipboardFunction = async ({
  textToCopy,
  snackBarMessage,
  onCopy,
}) => {
  try {
    await globalThis.navigator.clipboard.writeText(textToCopy)
    onCopy?.()
    showSuccessSnackBar(snackBarMessage ?? 'Copié\u00a0!')
  } catch {
    showErrorSnackBar('Une erreur est survenue, veuillez réessayer.')
  }
}
