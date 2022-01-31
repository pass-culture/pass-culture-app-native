import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { AppButton, BaseButtonProps } from 'ui/components/buttons/AppButton'
import { getSpacing } from 'ui/theme'

export const ButtonQuaternaryBlack: FunctionComponent<BaseButtonProps> = (props) => {
  return <StyledAppButton {...props} inlineHeight={getSpacing(5)} textSize={getSpacing(3)} />
}

const StyledAppButton = styled(AppButton).attrs(({ theme, disabled }) => {
  const { buttons, icons } = theme
  const loadingIconColor = buttons.quaternaryBlack.loadingIconColor
  let iconColor = buttons.quaternaryBlack.iconColor
  let textColor = buttons.quaternaryBlack.textColor
  const backgroundColor = buttons.quaternaryBlack.backgroundColor

  if (disabled) {
    textColor = buttons.disabled.quaternaryBlack.textColor
    iconColor = buttons.disabled.quaternaryBlack.iconColor
  }

  return {
    iconSize: icons.sizes.extraSmall,
    loadingIconColor: loadingIconColor,
    backgroundColor: backgroundColor,
    iconColor: iconColor,
    textColor: textColor,
  }
})``
