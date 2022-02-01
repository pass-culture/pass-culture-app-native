import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { AppButton, BaseButtonProps } from 'ui/components/buttons/AppButton'

export const ButtonTertiaryGreyDark: FunctionComponent<BaseButtonProps> = (props) => {
  return <StyledAppButton {...props} />
}

const StyledAppButton = styled(AppButton).attrs(({ theme, disabled }) => {
  const { buttons, icons } = theme
  const loadingIconColor = buttons.tertiaryGreyDark.loadingIconColor
  let iconColor = buttons.tertiaryGreyDark.iconColor
  let textColor = buttons.tertiaryGreyDark.textColor
  const backgroundColor = buttons.tertiaryGreyDark.backgroundColor

  if (disabled) {
    textColor = buttons.disabled.tertiaryGreyDark.textColor
    iconColor = buttons.disabled.tertiaryGreyDark.iconColor
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
