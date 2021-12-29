import React, { FunctionComponent } from 'react'

import { AppButton, BaseButtonProps } from 'ui/components/buttons/AppButton'
import { ColorsEnum } from 'ui/theme'

export const ButtonTertiaryWhite: FunctionComponent<BaseButtonProps> = (props) => {
  let textColor = ColorsEnum.WHITE
  const backgroundColor = ColorsEnum.TRANSPARENT
  const loadingIconColor = ColorsEnum.WHITE
  let iconColor = ColorsEnum.WHITE

  if (props.disabled) {
    textColor = iconColor = ColorsEnum.GREY_DARK
  }

  return (
    <AppButton
      {...props}
      iconSize={18}
      loadingIconColor={loadingIconColor}
      backgroundColor={backgroundColor}
      iconColor={iconColor}
      textColor={textColor}
    />
  )
}
