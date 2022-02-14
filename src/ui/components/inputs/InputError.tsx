import React, { FC } from 'react'

import { Error } from 'ui/svg/icons/Error'
import { Spacer } from 'ui/theme'
import { ErrorMessage } from 'ui/web/errors/ErrorMessage'

import { InputRule } from './rules/InputRule'

interface Props {
  messageId: string
  visible: boolean
  numberOfSpacesTop: number
  centered?: boolean
  relatedInputId?: string
}

export const InputError: FC<Props> = (props) => {
  return props.visible ? (
    <ErrorMessage relatedInputId={props.relatedInputId}>
      <Spacer.Column testID="input-error-top-spacer" numberOfSpaces={props.numberOfSpacesTop} />
      <InputRule
        title={props.messageId}
        isValid={false}
        icon={Error}
        testIdSuffix="warn"
        iconSize={16}
        centered={props.centered}
      />
    </ErrorMessage>
  ) : null
}
