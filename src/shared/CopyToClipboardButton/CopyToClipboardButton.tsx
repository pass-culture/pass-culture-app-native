import Clipboard from '@react-native-clipboard/clipboard'
import { FunctionComponent } from 'react'
import React from 'react-native'

import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { styledButton } from 'ui/components/buttons/styledButton'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { Duplicate } from 'ui/svg/icons/Duplicate'

interface Props {
  wording: string
  textToCopy: string
  onCopy?: () => void
  snackBarMessage?: string
}

export const CopyToClipboardButton: FunctionComponent<Props> = ({
  wording,
  textToCopy,
  onCopy,
  snackBarMessage,
}) => {
  const copyToClipboard = async () => {
    Clipboard.setString(textToCopy)
    if ((await Clipboard.getString()) === textToCopy) {
      onCopy?.()
      showSuccessSnackBar({
        message: snackBarMessage || 'Copié\u00a0!',
        timeout: SNACK_BAR_TIME_OUT,
      })
    } else {
      showErrorSnackBar({
        message: 'Une erreur est survenue, veuillez réessayer',
        timeout: SNACK_BAR_TIME_OUT,
      })
    }
  }
  const { showSuccessSnackBar, showErrorSnackBar } = useSnackBarContext()

  return <StyledButtonTertiary icon={Duplicate} wording={wording} onPress={copyToClipboard} />
}

const StyledButtonTertiary = styledButton(ButtonTertiaryBlack)({
  justifyContent: 'flex-start',
})
