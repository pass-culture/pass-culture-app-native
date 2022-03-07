import React from 'react'
import styled from 'styled-components/native'

import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { ButtonWithLinearGradientProps } from 'ui/components/buttons/buttonWithLinearGradientTypes'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { ExternalSite as InitialExternalSite } from 'ui/svg/icons/ExternalSite'
import { Rectangle as InitialRectangle } from 'ui/svg/Rectangle'
import { getSpacing, Typo } from 'ui/theme'

export const ButtonWithLinearGradient: React.FC<ButtonWithLinearGradientProps> = ({
  wording,
  onPress,
  isDisabled = false,
  isExternal = false,
}) => {
  return (
    <Container onPress={onPress} disabled={isDisabled} {...accessibilityAndTestId(wording)}>
      {isDisabled ? <DisabledRectangle /> : <Rectangle />}
      <LegendContainer>
        {!!isExternal && <ExternalSite />}
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

const Container = styled(TouchableOpacity)(({ theme }) => ({
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: theme.borderRadius.button,
  overflow: 'hidden',
}))

const Title = styled(Typo.ButtonText)<{ isDisabled: boolean }>(({ isDisabled, theme }) => ({
  color: isDisabled
    ? theme.buttons.disabled.linearGradient.textColor
    : theme.buttons.linearGradient.textColor,
  padding: getSpacing(5),
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

const ExternalSite = styled(InitialExternalSite).attrs(({ theme }) => ({
  size: theme.buttons.linearGradient.iconSize,
  color: theme.buttons.linearGradient.iconColor,
}))``
