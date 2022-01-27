import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { AppButton, BaseButtonProps } from 'ui/components/buttons/AppButton'

export const ButtonSecondaryWhite: FunctionComponent<BaseButtonProps> = (props) => {
  return <StyledAppButton {...props} />
}

const StyledAppButton = styled(AppButton).attrs(({ theme, isLoading, disabled }) => {
  const { buttons, icons } = theme
  const loadingIconColor = buttons.secondaryWhite.loadingIconColor
  let iconColor = buttons.secondaryWhite.iconColor
  let textColor = buttons.secondaryWhite.textColor
  const backgroundColor = buttons.secondaryWhite.backgroundColor
  let borderColor = buttons.secondaryWhite.borderColor

  if (isLoading) {
    borderColor = buttons.loading.secondaryWhite.borderColor
  } else if (disabled) {
    textColor = buttons.disabled.secondaryWhite.textColor
    iconColor = buttons.disabled.secondaryWhite.iconColor
    borderColor = buttons.disabled.secondaryWhite.borderColor
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
