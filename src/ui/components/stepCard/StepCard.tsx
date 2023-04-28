import React, { ReactElement, useMemo } from 'react'
import styled, { useTheme } from 'styled-components/native'

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

  const iconElement = useMemo(() => {
    return getIconWithColors(icon, disabled, theme.colors.greyMedium)
  }, [icon, disabled, theme.colors.greyMedium])

  return (
    <Container disabled={disabled} hasSubtitle={hasSubtitle} testID="stepcard-container">
      <IconContainer testID="stepcard-icon">{iconElement}</IconContainer>
      <TextContainter>
        <Title disabled={disabled}>{title}</Title>
        {!disabled && !!hasSubtitle ? <Subtitle>{subtitle}</Subtitle> : null}
      </TextContainter>
    </Container>
  )
}

const Container = styled.View<{ disabled?: boolean; hasSubtitle?: boolean }>(
  ({ theme, disabled, hasSubtitle }) => ({
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: theme.borderRadius.radius,
    paddingTop: hasSubtitle ? getSpacing(5) : getSpacing(6),
    paddingBottom: hasSubtitle ? getSpacing(5) : getSpacing(6),
    paddingLeft: getSpacing(4),
    paddingRight: getSpacing(4),
    borderColor: disabled ? theme.colors.greyMedium : theme.colors.black,
    margin: !disabled ? -4 : 0,
    gap: getSpacing(4),
  })
)

const IconContainer = styled.View({
  justifyContent: 'center',
})

const TextContainter = styled.View({
  flex: 1,
  justifyContent: 'center',
})

const Title = styled(Typo.ButtonText)<{ disabled?: boolean }>(({ theme, disabled }) => ({
  color: disabled ? theme.colors.greyDark : theme.colors.black,
}))

const Subtitle = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.greyDark,
}))

function getIconWithColors(icon: ReactElement, disabled: boolean, disabledColor: string) {
  if (!disabled) return icon

  return React.cloneElement(icon, { color: disabledColor, color2: disabledColor })
}
