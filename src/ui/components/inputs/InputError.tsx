import React, { FC, Fragment } from 'react'

import { WarningDeprecated } from 'ui/svg/icons/Warning_deprecated'
import { ColorsEnum, Spacer } from 'ui/theme'

import { InputRule } from './rules/InputRule'

interface Props {
  messageId: string
  visible: boolean
  numberOfSpacesTop: number
}

export const InputError: FC<Props> = (props) => {
  return props.visible ? (
    <Fragment>
      <Spacer.Column testID="input-error-top-spacer" numberOfSpaces={props.numberOfSpacesTop} />
      <InputRule
        title={props.messageId}
        color={ColorsEnum.ERROR}
        icon={WarningDeprecated}
        testIdSuffix="warn"
        iconSize={24}
      />
    </Fragment>
  ) : null
}
