import React from 'react'
import styled from 'styled-components/native'

import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { ButtonWithLinearGradientProps } from 'ui/components/buttons/buttonWithLinearGradientTypes'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { Email as InitialEmail } from 'ui/svg/icons/Email'
import { ExternalSite as InitialExternalSite } from 'ui/svg/icons/ExternalSite'
import { Rectangle as InitialRectangle } from 'ui/svg/Rectangle'
import { getSpacing, Typo } from 'ui/theme'

export const ButtonWithLinearGradient: React.FC<ButtonWithLinearGradientProps> = ({
  wording,
  onPress,
  isDisabled = false,
  isExternal = false,
  isEmail = false,
}) => {
  return (
    <Container onPress={onPress} disabled={isDisabled} {...accessibilityAndTestId(wording)}>
      {isDisabled ? <DisabledRectangle /> : <Rectangle />}
      <LegendContainer>
        {!!isExternal && <ExternalSite />}
        {!!isEmail && <Email />}
        <Title
          adjustsFontSizeToFit
          numberOfLines={1}
          isDisabled={isDisabled}
          padding={isEmail ? getSpacing(2) : getSpacing(5)}>
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

const Container = styled(TouchableOpacity)(({ theme }) => ({
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: theme.borderRadius.button,
  overflow: 'hidden',
}))

const Title = styled(Typo.ButtonText)<{ isDisabled: boolean; padding: number }>(
  ({ isDisabled, padding, theme }) => ({
    color: isDisabled
      ? theme.buttons.disabled.linearGradient.textColor
      : theme.buttons.linearGradient.textColor,
    padding,
  })
)

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

const ExternalSite = styled(InitialExternalSite).attrs(({ theme }) => ({
  size: theme.buttons.linearGradient.iconSize,
  color: theme.buttons.linearGradient.iconColor,
}))``

const Email = styled(InitialEmail).attrs(({ theme }) => ({
  size: theme.buttons.linearGradient.iconSize,
  color: theme.buttons.linearGradient.iconColor,
}))``
