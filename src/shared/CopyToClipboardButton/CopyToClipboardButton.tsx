import { FunctionComponent } from 'react'
import React from 'react-native'

import { useCopyToClipboard } from 'libs/useCopyToClipboard/useCopyToClipboard'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { styledButton } from 'ui/components/buttons/styledButton'
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
  const copyToClipboard = useCopyToClipboard({ textToCopy, snackBarMessage, onCopy })

  return <StyledButtonTertiary icon={Duplicate} wording={wording} onPress={copyToClipboard} />
}

const StyledButtonTertiary = styledButton(ButtonTertiaryBlack)({
  justifyContent: 'flex-start',
})
