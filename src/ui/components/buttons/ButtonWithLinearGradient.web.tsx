import React, { SyntheticEvent, useCallback } from 'react'
import styled from 'styled-components'
import styledNative from 'styled-components/native'

import { ButtonWithLinearGradientProps } from 'ui/components/buttons/buttonWithLinearGradientTypes'
import { ExternalSite as InitialExternalSite } from 'ui/svg/icons/ExternalSite'
import { getSpacing, Typo } from 'ui/theme'

export const ButtonWithLinearGradient: React.FC<ButtonWithLinearGradientProps> = ({
  wording,
  onPress,
  isDisabled = false,
  isExternal = false,
  type = 'button',
  name,
  className,
}) => {
  const onClick = useCallback(
    (event: SyntheticEvent) => {
      if (type === 'submit') {
        event.preventDefault()
      }
      if (onPress) {
        onPress()
      }
    },
    [onPress]
  )
  return (
    <Button name={name} onClick={onClick} disabled={isDisabled} type={type} className={className}>
      <LegendContainer>
        {!!isExternal && <ExternalSite />}
        <Title adjustsFontSizeToFit numberOfLines={1}>
          {wording}
        </Title>
      </LegendContainer>
    </Button>
  )
}

const Button = styled.button(({ theme }) => ({
  overflow: 'hidden',
  cursor: 'pointer',
  height: theme.buttons.buttonHeights.tall,
  borderRadius: theme.borderRadius.button,
  backgroundColor: theme.colors.primary,
  background: `linear-gradient(0.25turn, ${theme.colors.primary}, ${theme.colors.secondary})`,
  padding: 0,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  border: 0,
  ['&:focus']: {
    outline: 'auto',
  },
  ['&:active']: {
    opacity: theme.activeOpacity,
    outline: 'none',
  },
  ['&:disabled']: {
    cursor: 'initial',
    background: 'none',
    backgroundColor: theme.colors.primaryDisabled,
  },
}))

const Title = styledNative(Typo.ButtonText)(({ theme }) => ({
  color: theme.colors.white,
  padding: getSpacing(5),
}))

const LegendContainer = styledNative.View({
  position: 'absolute',
  alignItems: 'center',
  flexDirection: 'row',
})

const ExternalSite = styledNative(InitialExternalSite).attrs(({ theme }) => ({
  size: theme.buttons.linearGradient.iconSize,
  color: theme.buttons.linearGradient.iconColor,
}))``
