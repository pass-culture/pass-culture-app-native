import React, { ReactElement, useMemo } from 'react'
import styled, { DefaultTheme, useTheme } from 'styled-components/native'

import { getSpacing, Typo } from 'ui/theme'

export enum StepCardType {
  DONE = 'done',
  ACTIVE = 'active',
  DISABLED = 'disabled',
}

interface StepCardProps {
  title: string
  icon: ReactElement
  subtitle?: string
  type?: StepCardType
}

export const StepCard: React.FC<StepCardProps> = ({
  title,
  subtitle,
  icon,
  type = StepCardType.ACTIVE,
}) => {
  const hasSubtitle = !!subtitle
  const theme = useTheme()

  const iconElement = useMemo(() => {
    return getIconWithColors(icon, type, theme)
  }, [icon, type, theme])

  return (
    <Container type={type} hasSubtitle={hasSubtitle} testID="stepcard-container">
      <IconContainer type={type} testID="stepcard-icon">
        {iconElement}
      </IconContainer>
      <TextContainter>
        <Title type={type}>{title}</Title>
        <Subtitle type={type}>{subtitle}</Subtitle>
      </TextContainter>
    </Container>
  )
}

const Container = styled.View<{ type: StepCardType; hasSubtitle?: boolean }>(
  ({ theme, type, hasSubtitle }) => ({
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: theme.borderRadius.radius,
    paddingTop: hasSubtitle ? getSpacing(5) : getSpacing(6),
    paddingBottom: hasSubtitle ? getSpacing(5) : getSpacing(6),
    paddingLeft: getSpacing(4),
    paddingRight: getSpacing(4),
    borderColor: getBorderColor(type, theme),
    margin: type === StepCardType.ACTIVE ? -2 : 0,
    gap: getSpacing(4),
  })
)

const IconContainer = styled.View<{ type: StepCardType }>(({ type }) => ({
  justifyContent: 'center',
  transform: type === StepCardType.DONE ? `rotate(-8deg)` : undefined,
}))

const TextContainter = styled.View({
  flex: 1,
  justifyContent: 'center',
})

const Title = styled(Typo.ButtonText)<{ type: StepCardType }>(({ theme, type }) => ({
  color: type === StepCardType.ACTIVE ? theme.colors.black : theme.colors.greyDark,
}))

const Subtitle = styled(Typo.Caption)<{ type: StepCardType }>(({ theme, type }) => ({
  color: type === StepCardType.ACTIVE ? theme.colors.greyDark : theme.colors.greySemiDark,
}))

function getIconWithColors(icon: ReactElement, type: StepCardType, theme: DefaultTheme) {
  if (type === StepCardType.DISABLED) {
    return React.cloneElement(icon, {
      color: theme.colors.greyMedium,
      color2: theme.colors.greyMedium,
    })
  }
  if (type === StepCardType.DONE) {
    return React.cloneElement(icon, {
      color: theme.colors.greyDark,
      color2: theme.colors.greyDark,
    })
  }
  return icon
}

function getBorderColor(type: StepCardType, theme: DefaultTheme) {
  if (type === StepCardType.DONE) return theme.colors.greyDark
  if (type === StepCardType.DISABLED) return theme.colors.greyMedium
  return theme.colors.black
}
