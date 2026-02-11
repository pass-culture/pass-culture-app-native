import React, { FC } from 'react'

import { copyToClipboard } from 'libs/copyToClipboard/copyToClipboard'
import { Button } from 'ui/designSystem/Button/Button'
import { ButtonContainerFlexStart } from 'ui/designSystem/Button/ButtonContainerFlexStart'
import { Duplicate } from 'ui/svg/icons/Duplicate'

type Props = {
  wording: string
  textToCopy: string
  onCopy?: () => void
  snackBarMessage?: string
}

export const CopyToClipboardButton: FC<Props> = ({
  wording,
  textToCopy,
  onCopy,
  snackBarMessage,
}) => {
  const copy = () => copyToClipboard({ textToCopy, snackBarMessage, onCopy })

  return (
    <ButtonContainerFlexStart>
      <Button
        wording={wording}
        icon={Duplicate}
        onPress={copy}
        variant="tertiary"
        color="neutral"
      />
    </ButtonContainerFlexStart>
  )
}
