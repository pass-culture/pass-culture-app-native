import React, { FC, Fragment } from 'react'

import { Error } from 'ui/svg/icons/Error'
import { ColorsEnum, Spacer } from 'ui/theme'

import { InputRule } from './rules/InputRule'

interface Props {
  messageId: string
  visible: boolean
  numberOfSpacesTop: number
  centered?: boolean
}

export const InputError: FC<Props> = (props) => {
  return props.visible ? (
    <Fragment>
      <Spacer.Column testID="input-error-top-spacer" numberOfSpaces={props.numberOfSpacesTop} />
      <InputRule
        title={props.messageId}
        color={ColorsEnum.ERROR}
        icon={Error}
        testIdSuffix="warn"
        iconSize={16}
        centered={props.centered}
      />
    </Fragment>
  ) : null
}
