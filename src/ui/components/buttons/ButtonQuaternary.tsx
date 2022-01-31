import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { AppButton, BaseButtonProps } from 'ui/components/buttons/AppButton'
import { getSpacing } from 'ui/theme'

export const ButtonQuaternary: FunctionComponent<BaseButtonProps> = (props) => {
  return <StyledAppButton {...props} inlineHeight={getSpacing(5)} textSize={getSpacing(3)} />
}

const StyledAppButton = styled(AppButton).attrs(({ theme, disabled }) => {
  const { buttons, icons } = theme
  const loadingIconColor = buttons.quaternary.loadingIconColor
  let iconColor = buttons.quaternary.iconColor
  let textColor = buttons.quaternary.textColor
  const backgroundColor = buttons.quaternary.backgroundColor

  if (disabled) {
    textColor = buttons.disabled.quaternary.textColor
    iconColor = buttons.disabled.quaternary.iconColor
  }

  return {
    iconSize: icons.sizes.extraSmall,
    loadingIconColor: loadingIconColor,
    backgroundColor: backgroundColor,
    iconColor: iconColor,
    textColor: textColor,
  }
})``
