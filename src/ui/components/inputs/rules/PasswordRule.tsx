import React, { FunctionComponent } from 'react'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { InputRule } from 'ui/components/inputs/rules/InputRule'
import { Info } from 'ui/svg/icons/Info'
import { Valid } from 'ui/svg/icons/Valid'

type Props = {
  title: string
  isValidated: boolean
}

const NotMemoizedPasswordRule: FunctionComponent<Props> = ({ title, isValidated }) => {
  const validationLabel = isValidated ? 'validé' : 'minimum'
  const accessibilityLabel = `${title} ${validationLabel}`
  const ValidWithLabel = styled(Valid).attrs({
    accessibilityLabel,
  })``
  const InfoWithLabel = styled(Info).attrs({
    accessibilityLabel,
  })``
  const theme = useTheme()

  return (
    <InputRule
      title={title}
      icon={isValidated ? ValidWithLabel : InfoWithLabel}
      iconSize={theme.icons.sizes.smaller}
      testIdSuffix={isValidated ? 'check' : 'close'}
      type={isValidated ? 'Valid' : 'Neutral'}
    />
  )
}

export const PasswordRule = React.memo(NotMemoizedPasswordRule)
