import React, { SyntheticEvent, useCallback } from 'react'
import styled from 'styled-components'
import styledNative from 'styled-components/native'

import { genericStyle } from 'ui/components/buttons/buttonWithLinearGradient/styles/genericStyle.web'
import { ButtonWithLinearGradientProps } from 'ui/components/buttons/buttonWithLinearGradient/types'
import { getSpacing, Typo } from 'ui/theme'

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
}) => {
  const ButtonComponent = (href ? Link : Button) as React.ElementType
  const buttonLinkProps = { accessibilityRole, href, target }

  const Icon = icon
    ? styledNative(icon).attrs(({ theme }) => ({
        size: theme.buttons.linearGradient.iconSize,
        color: theme.buttons.linearGradient.iconColor,
      }))``
    : undefined

  const onClick = useCallback(
    (event: SyntheticEvent) => {
      if (type === 'submit' || href) {
        event.preventDefault()
      }
      if (onPress) {
        onPress()
      }
    },
    [type, href, onPress]
  )
  return (
    <ButtonComponent
      name={name}
      onClick={onClick}
      disabled={isDisabled}
      type={href ? undefined : type}
      className={className}
      testID={testID}
      fitContentWidth={fitContentWidth}
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

const LegendContainer = styledNative.View({
  alignItems: 'center',
  flexDirection: 'row',
})
