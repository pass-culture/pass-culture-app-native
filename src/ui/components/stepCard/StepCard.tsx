import React, { ReactElement } from 'react'
import styled, { DefaultTheme, useTheme } from 'styled-components/native'

import { getSpacing, Typo } from 'ui/theme'

interface StepCardProps {
  title: string
  icon: ReactElement
  subtitle?: string
  disabled?: boolean
}

export const StepCard: React.FC<StepCardProps> = ({ title, subtitle, icon, disabled = false }) => {
  const hasSubtitle = !!subtitle
  const theme = useTheme()
  const iconElement = getIconWithColors(icon, disabled, theme)

  return (
    <StepCardContainer disabled={disabled} hasSubtitle={hasSubtitle} testID="stepcard-container">
      <StepCardIcon testID="stepcard-icon">{iconElement}</StepCardIcon>
      <StepCardTextContainter>
        <StepCardTitle disabled={disabled}>{title}</StepCardTitle>
        {!disabled && !!hasSubtitle ? <StepCardSubtitle>{subtitle}</StepCardSubtitle> : null}
      </StepCardTextContainter>
    </StepCardContainer>
  )
}

const StepCardContainer = styled.View<{ disabled?: boolean; hasSubtitle?: boolean }>(
  ({ theme, disabled, hasSubtitle }) => ({
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: theme.borderRadius.radius,
    paddingTop: hasSubtitle ? getSpacing(5) : getSpacing(6),
    paddingBottom: hasSubtitle ? getSpacing(5) : getSpacing(6),
    paddingLeft: getSpacing(3),
    paddingRight: getSpacing(3),
    borderColor: disabled ? theme.colors.greyMedium : theme.colors.black,
    width: disabled ? '98%' : '100%',
  })
)

const StepCardIcon = styled.View({
  justifyContent: 'center',
})

const StepCardTextContainter = styled.View({
  flex: 1,
  marginLeft: getSpacing(4),
  justifyContent: 'center',
})

const StepCardTitle = styled(Typo.ButtonText)<{ disabled?: boolean }>(({ theme, disabled }) => ({
  color: disabled ? theme.colors.greyDark : theme.colors.black,
}))

const StepCardSubtitle = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.greyDark,
}))

function getIconWithColors(icon: ReactElement, disabled: boolean, theme: DefaultTheme) {
  const color1 = disabled ? theme.colors.greyMedium : theme.colors.primary
  const color2 = disabled ? theme.colors.greyMedium : theme.colors.secondary
  return React.cloneElement(icon, { color: color1, color2: color2 })
}
