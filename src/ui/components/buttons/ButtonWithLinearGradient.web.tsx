import { useLinkProps } from '@react-navigation/native'
import React, { SyntheticEvent, useCallback } from 'react'
import styled from 'styled-components'
import styledNative, { DefaultTheme } from 'styled-components/native'

import { ButtonWithLinearGradientProps } from 'ui/components/buttons/buttonWithLinearGradientTypes'
import { getSpacing, Typo } from 'ui/theme'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'

export const ButtonWithLinearGradient: React.FC<ButtonWithLinearGradientProps> = ({
  wording,
  onPress,
  isDisabled = false,
  type = 'button',
  name,
  className,
  externalHref,
  to,
  icon,
  testID,
}) => {
  const ButtonComponent = (to || externalHref ? Link : Button) as React.ElementType
  const internalLinkProps = useLinkProps({ to: to ?? '' })
  const externalLinkProps = { href: externalHref, accessibilityRole: 'link', target: '_blank' }
  const linkProps = externalHref ? externalLinkProps : internalLinkProps
  const buttonLinkProps = externalHref || to ? { ...linkProps, type: undefined } : {}

  const Icon = icon
    ? styledNative(icon).attrs(({ theme }) => ({
        size: theme.buttons.linearGradient.iconSize,
        color: theme.buttons.linearGradient.iconColor,
      }))``
    : undefined

  const onClick = useCallback(
    (event: SyntheticEvent) => {
      if (type === 'submit' || to || externalHref) {
        event.preventDefault()
      }
      if (onPress) {
        onPress()
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onPress]
  )
  return (
    <ButtonComponent
      name={name}
      onClick={onClick}
      disabled={isDisabled}
      type={type}
      className={className}
      testID={testID}
      {...buttonLinkProps}>
      <LegendContainer>
        {!!Icon && <Icon />}
        <Title adjustsFontSizeToFit numberOfLines={1} isDisabled={isDisabled}>
          {wording}
        </Title>
      </LegendContainer>
    </ButtonComponent>
  )
}

const gradientButtonStyles = ({ theme }: { theme: DefaultTheme }) => ({
  overflow: 'hidden',
  cursor: 'pointer',
  height: theme.buttons.buttonHeights.tall,
  borderRadius: theme.borderRadius.button,
  backgroundColor: theme.colors.primary,
  backgroundImage: `linear-gradient(0.25turn, ${theme.colors.primary}, ${theme.colors.secondary})`,
  padding: 0,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  border: 0,
  ['&:disabled']: {
    cursor: 'initial',
    background: 'none',
    color: theme.buttons.disabled.linearGradient.textColor,
    backgroundColor: theme.buttons.disabled.linearGradient.backgroundColor,
  },
  ...customFocusOutline(theme, theme.buttons.outlineColor),
})

const Button = styled.button(gradientButtonStyles)
const Link = styled.a(({ theme }) => ({
  ...gradientButtonStyles({ theme }),
  textDecoration: 'none',
  boxSizing: 'border-box',
}))

const Title = styledNative(Typo.ButtonText)<{ isDisabled: boolean }>(({ isDisabled, theme }) => ({
  color: isDisabled
    ? theme.buttons.disabled.linearGradient.textColor
    : theme.buttons.linearGradient.textColor,
  padding: getSpacing(2),
}))

const LegendContainer = styledNative.View({
  position: 'absolute',
  alignItems: 'center',
  flexDirection: 'row',
})
