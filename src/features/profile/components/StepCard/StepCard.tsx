import React, { ReactElement, useMemo } from 'react'
import { View, ViewProps } from 'react-native'
import styled, { DefaultTheme, useTheme } from 'styled-components/native'

import { StepButtonState } from 'ui/components/StepButton/types'
import { getSpacing, Typo, TypoDS } from 'ui/theme'

interface StepCardProps extends ViewProps {
  title: string
  icon: ReactElement
  subtitle?: string
  type?: StepButtonState
}

export function StepCard({
  title,
  subtitle,
  icon,
  type = StepButtonState.CURRENT,
  ...props
}: StepCardProps) {
  const hasSubtitle = !!subtitle
  const theme = useTheme()

  const shouldDisplaySubtitle = Boolean(hasSubtitle && type === StepButtonState.CURRENT)

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
          {shouldDisplaySubtitle ? <CaptionNeutralInfo>{subtitle}</CaptionNeutralInfo> : null}
        </TextContainter>
      </Container>
    </Parent>
  )
}

const Parent = styled(View)<{ type: StepButtonState }>(({ type }) => ({
  paddingHorizontal: type === StepButtonState.CURRENT ? 0 : 4,
  maxWidth: 500,
}))

const Container = styled.View<{ type: StepButtonState; hasSubtitle?: boolean }>(
  ({ theme, type, hasSubtitle }) => ({
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: theme.borderRadius.radius,
    paddingVertical: hasSubtitle ? getSpacing(5) : getSpacing(6),
    paddingHorizontal: getSpacing(4),
    borderColor: getBorderColor(type, theme),
  })
)

const IconContainer = styled.View<{ type: StepButtonState }>(({ type }) => ({
  justifyContent: 'center',
  transform: type === StepButtonState.COMPLETED ? `rotate(-8deg)` : undefined,
}))

const TextContainter = styled.View({
  flex: 1,
  justifyContent: 'center',
  marginLeft: getSpacing(4),
})

const Title = styled(Typo.ButtonText)<{ type: StepButtonState }>(({ theme, type }) => ({
  color: type === StepButtonState.CURRENT ? theme.colors.black : theme.colors.greyDark,
}))

const CaptionNeutralInfo = styled(TypoDS.BodyAccentXs)(({ theme }) => ({
  color: theme.colors.greyDark,
}))

function getIconWithColors(icon: ReactElement, type: StepButtonState, theme: DefaultTheme) {
  const color = getBorderColor(type, theme)

  return type === StepButtonState.CURRENT
    ? icon
    : React.cloneElement(icon, { color, color2: color })
}

function getBorderColor(type: StepButtonState, theme: DefaultTheme) {
  if (type === StepButtonState.COMPLETED) return theme.colors.greyDark
  if (type === StepButtonState.DISABLED) return theme.colors.greyMedium
  return theme.colors.black
}
