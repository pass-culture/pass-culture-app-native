import React from 'react'
import styled from 'styled-components/native'

import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { buttonWidthStyle } from 'ui/components/buttons/buttonWithLinearGradient/styleUtils'
import { ButtonWithLinearGradientProps } from 'ui/components/buttons/buttonWithLinearGradient/types'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { Rectangle as InitialRectangle } from 'ui/svg/Rectangle'
import { getSpacing, Typo } from 'ui/theme'

export const ButtonWithLinearGradient: React.FC<ButtonWithLinearGradientProps> = ({
  wording,
  onPress,
  isDisabled = false,
  icon,
  testID,
  fitContentWidth = false,
}) => {
  const Icon = icon
    ? styled(icon).attrs(({ theme }) => ({
        size: theme.buttons.linearGradient.iconSize,
        color: theme.buttons.linearGradient.iconColor,
      }))``
    : undefined

  return (
    <Container
      onBeforeNavigate={onPress}
      disabled={isDisabled}
      fitContentWidth={fitContentWidth}
      {...accessibilityAndTestId(wording, testID)}>
      {isDisabled ? <DisabledRectangle /> : <Rectangle />}
      <LegendContainer>
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

const Container = styled(TouchableLink)<{ fitContentWidth: boolean }>(
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

const LegendContainer = styled.View({
  position: 'absolute',
  alignItems: 'center',
  flexDirection: 'row',
})

const DisabledRectangle = styled.View(({ theme }) => ({
  width: '100%',
  height: getSpacing(12),
  backgroundColor: theme.buttons.disabled.linearGradient.backgroundColor,
}))
