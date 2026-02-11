import Clipboard from '@react-native-clipboard/clipboard'

import { CopyToClipboardFunction } from 'libs/copyToClipboard/copyToClipboard.types'
import { showErrorSnackBar, showSuccessSnackBar } from 'ui/designSystem/Snackbar/snackBar.store'

export const copyToClipboard: CopyToClipboardFunction = async ({
  textToCopy,
  snackBarMessage,
  onCopy,
}) => {
  Clipboard.setString(textToCopy)
  if ((await Clipboard.getString()) === textToCopy) {
    onCopy?.()
    showSuccessSnackBar(snackBarMessage ?? 'Copié\u00a0!')
  } else {
    showErrorSnackBar('Une erreur est survenue, veuillez réessayer.')
  }
}
