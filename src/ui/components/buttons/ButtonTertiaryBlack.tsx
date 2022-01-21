import React, { FunctionComponent } from 'react'

import { AppButton, BaseButtonProps } from 'ui/components/buttons/AppButton'
import { ColorsEnum } from 'ui/theme/colors'

export const ButtonTertiaryBlack: FunctionComponent<BaseButtonProps> = (props) => {
  let textColor = ColorsEnum.BLACK
  const backgroundColor = ColorsEnum.TRANSPARENT
  const loadingIconColor = ColorsEnum.BLACK
  let iconColor = ColorsEnum.BLACK

  if (props.disabled) {
    textColor = iconColor = ColorsEnum.GREY_DARK
  }

  return (
    <AppButton
      {...props}
      loadingIconColor={loadingIconColor}
      backgroundColor={backgroundColor}
      iconColor={iconColor}
      textColor={textColor}
      inlineHeight={20}
    />
  )
}
