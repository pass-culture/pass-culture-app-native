import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { AccessibleIcon } from 'ui/svg/icons/types'
import { getSpacing, Typo, Spacer } from 'ui/theme'
type Props = {
  title: string
  icon: FunctionComponent<AccessibleIcon>
  iconSize: number
  isValid: boolean
  testIdSuffix?: string
  noFullWidth?: boolean
}

export const InputRule: FunctionComponent<Props> = (props) => {
  const { title, icon, iconSize, isValid, testIdSuffix, noFullWidth } = props
  const Icon = styled(icon).attrs<{ testID: string }>(({ theme }) => ({
    color: isValid ? theme.colors.greenValid : theme.colors.error,
    size: iconSize,
  }))``

  return (
    <StyledView noFullWidth={noFullWidth}>
      <StyledCaption isValid={isValid} noFullWidth={noFullWidth}>
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
  isValid: boolean
  noFullWidth?: boolean
}>(({ isValid, theme, noFullWidth }) => ({
  paddingLeft: getSpacing(1),
  flexShrink: 1,
  color: isValid ? theme.colors.greenValid : theme.colors.error,
  ...(noFullWidth ? { textAlign: 'center' } : {}),
}))
