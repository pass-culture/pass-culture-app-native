import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { InputRule } from 'ui/components/inputs/rules/InputRule'
import { Check } from 'ui/svg/icons/Check'
import { Close } from 'ui/svg/icons/Close'

type Props = {
  title: string
  isValidated: boolean
}

const NotMemoizedPasswordRule: FunctionComponent<Props> = ({ title, isValidated }) => {
  const validationLabel = isValidated ? 'validé' : 'minimum'
  const accessibilityLabel = `${title} ${validationLabel}`
  const CheckWithLabel = styled(Check).attrs({
    accessibilityLabel,
  })``
  const CloseWithLabel = styled(Close).attrs({
    accessibilityLabel,
  })``

  return (
    <InputRule
      title={title}
      icon={isValidated ? CheckWithLabel : CloseWithLabel}
      iconSize={10}
      testIdSuffix={isValidated ? 'check' : 'close'}
      isValid={isValidated}
    />
  )
}

export const PasswordRule = React.memo(NotMemoizedPasswordRule)
