import React, { FunctionComponent } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { ColorsType, TextColorKey } from 'theme/types'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { Spacer, TypoDS, getSpacing } from 'ui/theme'

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
  noFullWidth = false,
}: Props) => {
  const theme = useTheme()
  const colorMapping: Record<InputRuleType, { text: TextColorKey; icon: ColorsType }> = {
    Valid: {
      text: 'success',
      icon: theme.designSystem.color.icon.success,
    },
    Error: {
      text: 'error',
      icon: theme.designSystem.color.icon.error,
    },
    Neutral: {
      text: 'default',
      icon: theme.designSystem.color.icon.default,
    },
  }

  const { text: color, icon: colorIcon } = colorMapping[type]

  const Icon = styled(icon).attrs<{ testID: string }>({
    color: colorIcon,
    size: iconSize,
  })``

  return (
    <StyledView noFullWidth={noFullWidth}>
      <StyledCaption color={color} noFullWidth={noFullWidth}>
        {title}
      </StyledCaption>
      <Spacer.Row numberOfSpaces={1} />
      <IconContainer>
        <Icon testID={testIdSuffix ? `rule-icon-${testIdSuffix}` : undefined} />
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

const StyledCaption = styled(TypoDS.BodyAccentXs)<{
  noFullWidth?: boolean
}>(({ noFullWidth }) => ({
  paddingLeft: getSpacing(1),
  flexShrink: 1,
  ...(noFullWidth ? { textAlign: 'center' } : {}),
}))
