import React, { FunctionComponent } from 'react'
import { useTheme } from 'styled-components'

import { InputRule } from 'ui/components/inputs/rules/InputRule'
import { Info } from 'ui/svg/icons/Info'
import { Valid } from 'ui/svg/icons/Valid'

type Props = {
  title: string
  isValidated: boolean
}

const NotMemoizedPasswordRule: FunctionComponent<Props> = ({ title, isValidated }) => {
  const validationLabel = isValidated ? '- critère validé' : '- au minimum'
  const accessibilityLabel = `${title} ${validationLabel}`
  const { icons } = useTheme()

  return (
    <InputRule
      title={title}
      icon={isValidated ? Valid : Info}
      iconSize={icons.sizes.smaller}
      testIdSuffix={isValidated ? 'check' : 'close'}
      type={isValidated ? 'Valid' : 'Neutral'}
      accessibilityLabel={accessibilityLabel}
    />
  )
}

export const PasswordRule = React.memo(NotMemoizedPasswordRule)
