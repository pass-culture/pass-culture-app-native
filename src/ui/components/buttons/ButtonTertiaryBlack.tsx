import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { AppButton, BaseButtonProps } from 'ui/components/buttons/AppButton'

export const ButtonTertiaryBlack: FunctionComponent<BaseButtonProps> = (props) => {
  return <StyledAppButton {...props} />
}

const StyledAppButton = styled(AppButton).attrs(({ theme, disabled }) => {
  const { buttons, icons } = theme
  const loadingIconColor = buttons.tertiaryBlack.loadingIconColor
  let iconColor = buttons.tertiaryBlack.iconColor
  let textColor = buttons.tertiaryBlack.textColor
  const backgroundColor = buttons.tertiaryBlack.backgroundColor

  if (disabled) {
    textColor = buttons.disabled.tertiaryBlack.textColor
    iconColor = buttons.disabled.tertiaryBlack.iconColor
  }

  return {
    iconSize: icons.sizes.smaller,
    loadingIconColor: loadingIconColor,
    backgroundColor: backgroundColor,
    iconColor: iconColor,
    textColor: textColor,
    inlineHeight: icons.sizes.smaller,
  }
})``
