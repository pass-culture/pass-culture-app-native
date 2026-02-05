import React from 'react'
import styled from 'styled-components/native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { buttonWidthStyle } from 'ui/components/buttons/buttonWithLinearGradient/styleUtils'
import { ButtonWithLinearGradientDeprecatedPropsProps } from 'ui/components/buttons/buttonWithLinearGradient/types'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { Rectangle as InitialRectangle } from 'ui/svg/Rectangle'
import { Typo } from 'ui/theme'

export const ButtonWithLinearGradientDeprecated: React.FC<
  ButtonWithLinearGradientDeprecatedPropsProps
> = ({ wording, onPress, isDisabled = false, icon, fitContentWidth = false, iconAfterWording }) => {
  const Icon = icon
    ? styled(icon).attrs(({ theme }) => ({
        size: theme.buttons.linearGradient.iconSize,
        color: theme.designSystem.color.icon.inverted,
      }))``
    : undefined

  return (
    <Container
      onPress={isDisabled ? undefined : onPress}
      disabled={isDisabled}
      fitContentWidth={fitContentWidth}
      accessibilityRole={AccessibilityRole.LINK}
      accessibilityLabel={wording}>
      {isDisabled ? <DisabledRectangle /> : <Rectangle />}
      <LegendContainer reverse={iconAfterWording}>
        {Icon ? <Icon /> : null}
        <Title adjustsFontSizeToFit numberOfLines={1} isDisabled={isDisabled}>
          {wording}
        </Title>
      </LegendContainer>
    </Container>
  )
}

const Rectangle = styled(InitialRectangle).attrs(({ theme }) => ({
  height: theme.designSystem.size.spacing.xxxxl,
  size: '100%',
}))``

const Container = styled(TouchableOpacity)<{ fitContentWidth: boolean }>(({
  theme,
  fitContentWidth,
}) => {
  return {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.designSystem.size.borderRadius.xl,
    overflow: 'hidden',
    ...buttonWidthStyle({ fitContentWidth }),
  }
})

const Title = styled(Typo.Button)<{ isDisabled: boolean }>(({ isDisabled, theme }) => ({
  color: isDisabled
    ? theme.designSystem.color.text.disabled
    : theme.designSystem.color.text.inverted,
  padding: theme.designSystem.size.spacing.s,
}))

const LegendContainer = styled.View<{ reverse?: boolean }>(({ reverse }) => ({
  position: 'absolute',
  alignItems: 'center',
  flexDirection: reverse ? 'row-reverse' : 'row',
}))

const DisabledRectangle = styled.View(({ theme }) => ({
  width: '100%',
  height: theme.designSystem.size.spacing.xxxxl,
  backgroundColor: theme.designSystem.color.background.disabled,
}))
