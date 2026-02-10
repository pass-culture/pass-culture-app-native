import React from 'react'

import { useCopyToClipboard } from 'libs/useCopyToClipboard/useCopyToClipboard'
import { Button } from 'ui/designSystem/Button/Button'
import { ButtonContainerFlexStart } from 'ui/designSystem/Button/ButtonContainerFlexStart'
import { Duplicate } from 'ui/svg/icons/Duplicate'

interface Props {
  wording: string
  textToCopy: string
  onCopy?: () => void
  snackBarMessage?: string
}

export const CopyToClipboardButton = ({ wording, textToCopy, onCopy, snackBarMessage }: Props) => {
  const copyToClipboard = useCopyToClipboard({ textToCopy, snackBarMessage, onCopy })

  return (
    <ButtonContainerFlexStart>
      <Button
        wording={wording}
        icon={Duplicate}
        onPress={copyToClipboard}
        variant="tertiary"
        color="neutral"
      />
    </ButtonContainerFlexStart>
  )
}
