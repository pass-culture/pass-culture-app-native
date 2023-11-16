import React, { ReactElement, useMemo } from 'react'
import { View, ViewProps } from 'react-native'
import styled, { DefaultTheme, useTheme } from 'styled-components/native'

import { getSpacing, Typo } from 'ui/theme'

export enum StepCardType {
  DONE = 'done',
  ACTIVE = 'active',
  DISABLED = 'disabled',
}

interface StepCardProps extends ViewProps {
  title: string
  icon: ReactElement
  subtitle?: string
  type?: StepCardType
}

export function StepCard({
  title,
  subtitle,
  icon,
  type = StepCardType.ACTIVE,
  ...props
}: Readonly<StepCardProps>) {
  const hasSubtitle = !!subtitle
  const theme = useTheme()

  const shouldDisplaySubtitle = Boolean(hasSubtitle && type === StepCardType.ACTIVE)

  const iconElement = useMemo(() => {
    return getIconWithColors(icon, type, theme)
  }, [icon, type, theme])

  return (
    <Parent type={type} {...props}>
      <Container type={type} hasSubtitle={hasSubtitle} testID="stepcard-container">
        <IconContainer type={type} testID="stepcard-icon">
          {iconElement}
        </IconContainer>
        <TextContainter>
          <Title type={type}>{title}</Title>
          {!!shouldDisplaySubtitle && <Typo.CaptionNeutralInfo>{subtitle}</Typo.CaptionNeutralInfo>}
        </TextContainter>
      </Container>
    </Parent>
  )
}

const Parent = styled(View)<{ type: StepCardType }>(({ type }) => ({
  paddingHorizontal: type === StepCardType.ACTIVE ? 0 : 4,
  maxWidth: 500,
}))

const Container = styled.View<{ type: StepCardType; hasSubtitle?: boolean }>(
  ({ theme, type, hasSubtitle }) => ({
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: theme.borderRadius.radius,
    paddingVertical: hasSubtitle ? getSpacing(5) : getSpacing(6),
    paddingHorizontal: getSpacing(4),
    borderColor: getBorderColor(type, theme),
  })
)

const IconContainer = styled.View<{ type: StepCardType }>(({ type }) => ({
  justifyContent: 'center',
  transform: type === StepCardType.DONE ? `rotate(-8deg)` : undefined,
}))

const TextContainter = styled.View({
  flex: 1,
  justifyContent: 'center',
  marginLeft: getSpacing(4),
})

const Title = styled(Typo.ButtonText)<{ type: StepCardType }>(({ theme, type }) => ({
  color: type === StepCardType.ACTIVE ? theme.colors.black : theme.colors.greyDark,
}))

function getIconWithColors(icon: ReactElement, type: StepCardType, theme: DefaultTheme) {
  const color = getBorderColor(type, theme)

  return type === StepCardType.ACTIVE ? icon : React.cloneElement(icon, { color, color2: color })
}

function getBorderColor(type: StepCardType, theme: DefaultTheme) {
  if (type === StepCardType.DONE) return theme.colors.greyDark
  if (type === StepCardType.DISABLED) return theme.colors.greyMedium
  return theme.colors.black
}
