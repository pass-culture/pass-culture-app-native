import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { AppButton, BaseButtonProps } from 'ui/components/buttons/AppButton'

export const ButtonPrimaryWhite: FunctionComponent<BaseButtonProps> = (props) => {
  return <StyledAppButton {...props} />
}

const StyledAppButton = styled(AppButton).attrs(({ theme, disabled }) => {
  const { buttons, icons } = theme
  const loadingIconColor = buttons.primaryWhite.loadingIconColor
  let iconColor = buttons.primaryWhite.iconColor
  let textColor = buttons.primaryWhite.textColor
  const backgroundColor = buttons.primaryWhite.backgroundColor

  if (disabled) {
    textColor = buttons.disabled.primaryWhite.textColor
    iconColor = buttons.disabled.primaryWhite.iconColor
  }

  return {
    iconSize: icons.sizes.small,
    loadingIconColor: loadingIconColor,
    backgroundColor: backgroundColor,
    iconColor: iconColor,
    textColor: textColor,
  }
})``
