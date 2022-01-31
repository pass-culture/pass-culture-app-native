import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { AppButton, BaseButtonProps } from 'ui/components/buttons/AppButton'

export const ButtonTertiaryWhite: FunctionComponent<BaseButtonProps> = (props) => {
  return <StyledAppButton {...props} />
}

const StyledAppButton = styled(AppButton).attrs(({ theme, disabled }) => {
  const { buttons, icons } = theme
  const loadingIconColor = buttons.tertiaryWhite.loadingIconColor
  let iconColor = buttons.tertiaryWhite.iconColor
  let textColor = buttons.tertiaryWhite.textColor
  const backgroundColor = buttons.tertiaryWhite.backgroundColor

  if (disabled) {
    textColor = buttons.disabled.tertiaryWhite.textColor
    iconColor = buttons.disabled.tertiaryWhite.iconColor
  }

  return {
    iconSize: icons.sizes.smaller,
    loadingIconColor: loadingIconColor,
    backgroundColor: backgroundColor,
    iconColor: iconColor,
    textColor: textColor,
  }
})``
