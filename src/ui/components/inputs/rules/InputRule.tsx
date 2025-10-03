import React, { FunctionComponent } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { ColorsType, TextColorKey } from 'theme/types'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { Typo } from 'ui/theme'

type InputRuleType = 'Valid' | 'Error' | 'Neutral'

type Props = {
  title: string
  icon: FunctionComponent<AccessibleIcon>
  iconSize: number
  type: InputRuleType
  testIdSuffix?: string
  noFullWidth?: boolean
  accessibilityLabel?: string
}

export const InputRule: FunctionComponent<Props> = ({
  title,
  icon,
  iconSize,
  type,
  testIdSuffix,
  noFullWidth = false,
  accessibilityLabel,
}: Props) => {
  const { designSystem } = useTheme()

  const colorMapping: Record<InputRuleType, { text: TextColorKey; icon: ColorsType }> = {
    Valid: { text: 'success', icon: designSystem.color.icon.success },
    Error: { text: 'error', icon: designSystem.color.icon.error },
    Neutral: { text: 'default', icon: designSystem.color.icon.default },
  }

  const { text: color, icon: colorIcon } = colorMapping[type]

  const Icon = styled(icon).attrs<{ testID: string }>({ color: colorIcon, size: iconSize })``

  return (
    <StyledView noFullWidth={noFullWidth} gap={1}>
      <StyledCaption
        color={color}
        noFullWidth={noFullWidth}
        accessibilityLabel={accessibilityLabel}>
        {title}
      </StyledCaption>
      <IconContainer>
        <Icon testID={`rule-icon-${testIdSuffix ?? ''}`} />
      </IconContainer>
    </StyledView>
  )
}

const IconContainer = styled.View({
  flexShrink: 0,
})

const StyledView = styled(ViewGap)<{ noFullWidth?: boolean }>(({ noFullWidth, theme }) => ({
  flexDirection: 'row-reverse', // For accessibility purposes, we switch the title and the icon in the DOM so the VoiceOver restitution makes sense.
  maxWidth: theme.forms.maxWidth,
  alignItems: 'center',
  justifyContent: 'flex-end',
  ...(noFullWidth ? {} : { width: '100%' }),
}))

const StyledCaption = styled(Typo.BodyAccentXs)<{
  noFullWidth?: boolean
}>(({ theme, noFullWidth }) => ({
  paddingLeft: theme.designSystem.size.spacing.xs,
  flexShrink: 1,
  ...(noFullWidth ? { textAlign: 'center' } : {}),
}))
