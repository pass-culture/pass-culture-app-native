import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { AppButton, BaseButtonProps } from 'ui/components/buttons/AppButton'

export const ButtonPrimary: FunctionComponent<BaseButtonProps> = (props) => {
  return <StyledAppButton {...props} />
}

const StyledAppButton = styled(AppButton).attrs(({ theme, isLoading, disabled }) => {
  const { buttons, icons } = theme
  const loadingIconColor = buttons.primary.loadingIconColor
  const iconColor = buttons.primary.iconColor
  let textColor = buttons.primary.textColor
  let backgroundColor = buttons.primary.backgroundColor

  if (isLoading) {
    backgroundColor = buttons.loading.primary.backgroundColor
  } else if (disabled) {
    backgroundColor = buttons.disabled.primary.backgroundColor
    textColor = buttons.disabled.primary.textColor
  }

  return {
    iconSize: icons.sizes.small,
    loadingIconColor: loadingIconColor,
    backgroundColor: backgroundColor,
    iconColor: iconColor,
    textColor: textColor,
  }
})``
