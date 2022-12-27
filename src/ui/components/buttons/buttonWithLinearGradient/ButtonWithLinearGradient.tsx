import React from 'react'
import styled from 'styled-components/native'

import { buttonWidthStyle } from 'ui/components/buttons/buttonWithLinearGradient/styleUtils'
import { ButtonWithLinearGradientProps } from 'ui/components/buttons/buttonWithLinearGradient/types'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { Rectangle as InitialRectangle } from 'ui/svg/Rectangle'
import { getSpacing, Typo } from 'ui/theme'

export const ButtonWithLinearGradient: React.FC<ButtonWithLinearGradientProps> = ({
  wording,
  onPress,
  isDisabled = false,
  icon,
  fitContentWidth = false,
  iconAfterWording,
}) => {
  const Icon = icon
    ? styled(icon).attrs(({ theme }) => ({
        size: theme.buttons.linearGradient.iconSize,
        color: theme.buttons.linearGradient.iconColor,
      }))``
    : undefined

  return (
    <Container
      onPress={isDisabled ? undefined : onPress}
      disabled={isDisabled}
      fitContentWidth={fitContentWidth}
      accessibilityRole="link"
      accessibilityLabel={wording}>
      {isDisabled ? <DisabledRectangle /> : <Rectangle />}
      <LegendContainer reverse={iconAfterWording}>
        {!!Icon && <Icon />}
        <Title adjustsFontSizeToFit numberOfLines={1} isDisabled={isDisabled}>
          {wording}
        </Title>
      </LegendContainer>
    </Container>
  )
}

const Rectangle = styled(InitialRectangle).attrs({
  height: getSpacing(12),
  size: '100%',
})``

const Container = styled(TouchableOpacity)<{ fitContentWidth: boolean }>(
  ({ theme, fitContentWidth }) => {
    return {
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: theme.borderRadius.button,
      overflow: 'hidden',
      ...buttonWidthStyle({ fitContentWidth }),
    }
  }
)

const Title = styled(Typo.ButtonText)<{ isDisabled: boolean }>(({ isDisabled, theme }) => ({
  color: isDisabled
    ? theme.buttons.disabled.linearGradient.textColor
    : theme.buttons.linearGradient.textColor,
  padding: getSpacing(2),
}))

const LegendContainer = styled.View<{ reverse?: boolean }>(({ reverse }) => ({
  position: 'absolute',
  alignItems: 'center',
  flexDirection: reverse ? 'row-reverse' : 'row',
}))

const DisabledRectangle = styled.View(({ theme }) => ({
  width: '100%',
  height: getSpacing(12),
  backgroundColor: theme.buttons.disabled.linearGradient.backgroundColor,
}))
