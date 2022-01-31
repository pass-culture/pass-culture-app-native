import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { AppButton, BaseButtonProps } from 'ui/components/buttons/AppButton'

export const ButtonSecondary: FunctionComponent<BaseButtonProps> = (props) => {
  return <StyledAppButton {...props} />
}

const StyledAppButton = styled(AppButton).attrs(({ theme, isLoading, disabled }) => {
  const { buttons, icons } = theme
  const loadingIconColor = buttons.secondary.loadingIconColor
  let iconColor = buttons.secondary.iconColor
  let textColor = buttons.secondary.textColor
  const backgroundColor = buttons.secondary.backgroundColor
  let borderColor = buttons.secondary.borderColor

  if (isLoading) {
    borderColor = buttons.loading.secondary.borderColor
  } else if (disabled) {
    textColor = buttons.disabled.secondary.textColor
    iconColor = buttons.disabled.secondary.iconColor
    borderColor = buttons.disabled.secondary.borderColor
  }

  return {
    iconSize: icons.sizes.small,
    loadingIconColor: loadingIconColor,
    backgroundColor: backgroundColor,
    iconColor: iconColor,
    textColor: textColor,
    borderColor: borderColor,
  }
})``
