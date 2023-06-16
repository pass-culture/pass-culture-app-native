import React, { FunctionComponent } from 'react'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { AccessibleIcon } from 'ui/svg/icons/types'
import { getSpacing, Typo, Spacer } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

type InputRuleType = 'Valid' | 'Error' | 'Neutral'

type Props = {
  title: string
  icon: FunctionComponent<AccessibleIcon>
  iconSize: number
  type: InputRuleType
  testIdSuffix?: string
  noFullWidth?: boolean
}

export const InputRule: FunctionComponent<Props> = ({
  title,
  icon,
  iconSize,
  type,
  testIdSuffix,
  noFullWidth,
}: Props) => {
  const theme = useTheme()
  const baseColor = type === 'Valid' ? theme.colors.greenValid : theme.colors.black
  const color = type === 'Error' ? theme.colors.error : baseColor
  const Icon = styled(icon).attrs<{ testID: string }>({
    color: color,
    size: iconSize,
  })``

  return (
    <StyledView noFullWidth={noFullWidth}>
      <StyledCaption color={color} noFullWidth={noFullWidth}>
        {title}
      </StyledCaption>
      <Spacer.Row numberOfSpaces={1} />
      <IconContainer>
        <Icon testID={`rule-icon-${testIdSuffix}`} />
      </IconContainer>
    </StyledView>
  )
}

const IconContainer = styled.View({ flexShrink: 0 })

const StyledView = styled.View<{ noFullWidth?: boolean }>(({ noFullWidth, theme }) => ({
  flexDirection: 'row-reverse', // For accessibility purposes, we switch the title and the icon in the DOM so the VoiceOver restitution makes sense.
  maxWidth: theme.forms.maxWidth,
  alignItems: 'center',
  justifyContent: 'flex-end',
  ...(noFullWidth ? {} : { width: '100%' }),
}))

const StyledCaption = styled(Typo.Caption)<{
  color: ColorsEnum
  noFullWidth?: boolean
}>(({ color, noFullWidth }) => ({
  paddingLeft: getSpacing(1),
  flexShrink: 1,
  color,
  ...(noFullWidth ? { textAlign: 'center' } : {}),
}))
