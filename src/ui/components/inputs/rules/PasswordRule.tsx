import React, { FunctionComponent } from 'react'

import { InputRule } from 'ui/components/inputs/rules/InputRule'
import { CheckDeprecated as Check } from 'ui/svg/icons/Check_deprecated'
import { Close } from 'ui/svg/icons/Close'
import { ColorsEnum } from 'ui/theme'

type Props = {
  title: string
  isValidated: boolean
}

export const PasswordRule: FunctionComponent<Props> = ({ title, isValidated }) => {
  return (
    <InputRule
      title={title}
      icon={isValidated ? Check : Close}
      iconSize={16}
      testIdSuffix={isValidated ? 'check' : 'close'}
      color={isValidated ? ColorsEnum.GREEN_VALID : ColorsEnum.ERROR}
    />
  )
}
