import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { AppButton, BaseButtonProps } from 'ui/components/buttons/AppButton'

export const ButtonTertiary: FunctionComponent<BaseButtonProps> = (props) => {
  return <StyledAppButton {...props} />
}

const StyledAppButton = styled(AppButton).attrs(({ theme, disabled }) => {
  const { buttons, icons } = theme
  const loadingIconColor = buttons.tertiary.loadingIconColor
  let iconColor = buttons.tertiary.iconColor
  let textColor = buttons.tertiary.textColor
  const backgroundColor = buttons.tertiary.backgroundColor

  if (disabled) {
    textColor = buttons.disabled.tertiary.textColor
    iconColor = buttons.disabled.tertiary.iconColor
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
