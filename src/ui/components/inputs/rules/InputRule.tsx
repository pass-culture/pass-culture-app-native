import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { IconInterface } from 'ui/svg/icons/types'
import { getSpacing, Typo, Spacer } from 'ui/theme'
type Props = {
  title: string
  icon: FunctionComponent<IconInterface>
  iconSize: number
  isValid: boolean
  testIdSuffix?: string
  centered?: boolean
}

export const InputRule: FunctionComponent<Props> = (props) => {
  const { title, icon, iconSize, isValid, testIdSuffix, centered } = props
  const Icon = styled(icon).attrs<{ testID: string }>(({ theme }) => ({
    color: isValid ? theme.colors.greenValid : theme.colors.error,
    size: iconSize,
  }))``

  return (
    <StyledView centered={centered}>
      <Icon testID={`rule-icon-${testIdSuffix}`} />
      <Spacer.Row numberOfSpaces={1} />
      <StyledCaption isValid={isValid} centered={centered}>
        {title}
      </StyledCaption>
    </StyledView>
  )
}

const StyledView = styled.View<{ centered?: boolean }>(({ centered, theme }) => ({
  flexDirection: 'row',
  maxWidth: theme.forms.maxWidth,
  alignItems: 'center',
  ...(centered ? {} : { width: '100%' }),
}))

const StyledCaption = styled(Typo.Caption)<{
  isValid: boolean
  centered?: boolean
}>(({ isValid, theme, centered }) => ({
  paddingLeft: getSpacing(1),
  flexShrink: 1,
  color: isValid ? theme.colors.greenValid : theme.colors.error,
  ...(centered ? { textAlign: 'center' } : {}),
}))
