import React, { FC } from 'react'

import { Error } from 'ui/svg/icons/Error'
import { Spacer } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'
import { ErrorMessage } from 'ui/web/errors/ErrorMessage'

import { InputRule } from './rules/InputRule'

interface Props {
  messageId: string
  visible: boolean
  numberOfSpacesTop: number
  centered?: boolean
}

export const InputError: FC<Props> = (props) => {
  return props.visible ? (
    <ErrorMessage>
      <Spacer.Column testID="input-error-top-spacer" numberOfSpaces={props.numberOfSpacesTop} />
      <InputRule
        title={props.messageId}
        color={ColorsEnum.ERROR}
        icon={Error}
        testIdSuffix="warn"
        iconSize={16}
        centered={props.centered}
      />
    </ErrorMessage>
  ) : null
}
