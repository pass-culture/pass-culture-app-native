import React from 'react'
import styled from 'styled-components'
import styledNative, { DefaultTheme } from 'styled-components/native'

import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { buttonWidthStyle } from 'ui/components/buttons/buttonWithLinearGradient/styleUtils'
import { ButtonWithLinearGradientProps } from 'ui/components/buttons/buttonWithLinearGradient/types'
import { getSpacing, Typo } from 'ui/theme'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'
import { getHoverStyle } from 'ui/theme/getHoverStyle/getHoverStyle'

export const ButtonWithLinearGradient: React.FC<ButtonWithLinearGradientProps> = ({
  wording,
  onPress,
  isDisabled = false,
  type = 'button',
  name,
  className,
  icon,
  accessibilityRole,
  href,
  target,
  testID,
  fitContentWidth = false,
  iconAfterWording,
}) => {
  const ButtonComponent = (href ? Link : Button) as React.ElementType
  const buttonLinkProps = { accessibilityRole, href, target }

  const Icon = icon
    ? styledNative(icon).attrs(({ theme }) => ({
        size: theme.buttons.linearGradient.iconSize,
        color: theme.buttons.linearGradient.iconColor,
      }))``
    : undefined

  return (
    <ButtonComponent
      name={name}
      onClick={onPress}
      disabled={isDisabled}
      type={href ? undefined : type}
      className={className}
      fitContentWidth={fitContentWidth}
      {...accessibilityAndTestId(wording, testID)}
      {...buttonLinkProps}>
      <LegendContainer reverse={iconAfterWording}>
        {!!Icon && <Icon />}
        <Title adjustsFontSizeToFit numberOfLines={1} isDisabled={isDisabled}>
          {wording}
        </Title>
      </LegendContainer>
    </ButtonComponent>
  )
}

type GenericStyleProps = {
  theme: DefaultTheme
  fitContentWidth: boolean
}

const genericStyle = ({ theme, fitContentWidth }: GenericStyleProps) => {
  return {
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
    ...customFocusOutline({ color: theme.buttons.outlineColor }),
    ...getHoverStyle(theme.buttons.linearGradient.textColor),
    ...buttonWidthStyle({ fitContentWidth }),
  }
}

const Button = styled.button<{ fitContentWidth: boolean }>(({ theme, fitContentWidth }) => ({
  ...genericStyle({ theme, fitContentWidth }),
}))

const Link = styled.a<{ fitContentWidth: boolean }>(({ theme, fitContentWidth }) => ({
  ...genericStyle({ theme, fitContentWidth }),
  textDecoration: 'none',
  boxSizing: 'border-box',
}))

const Title = styledNative(Typo.ButtonText)<{ isDisabled: boolean }>(({ isDisabled, theme }) => ({
  color: isDisabled
    ? theme.buttons.disabled.linearGradient.textColor
    : theme.buttons.linearGradient.textColor,
  padding: getSpacing(2),
}))

const LegendContainer = styledNative.View<{ reverse?: boolean }>(({ reverse }) => ({
  alignItems: 'center',
  flexDirection: reverse ? 'row-reverse' : 'row',
}))
