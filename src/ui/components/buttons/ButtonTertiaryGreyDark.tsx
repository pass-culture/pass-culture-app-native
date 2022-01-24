import React, { FunctionComponent } from 'react'

import { AppButton, BaseButtonProps } from 'ui/components/buttons/AppButton'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

export const ButtonTertiaryGreyDark: FunctionComponent<BaseButtonProps> = (props) => {
  let textColor = ColorsEnum.GREY_DARK
  const backgroundColor = ColorsEnum.TRANSPARENT
  const loadingIconColor = ColorsEnum.GREY_DARK
  let iconColor = ColorsEnum.GREY_DARK

  if (props.disabled) {
    textColor = iconColor = ColorsEnum.PRIMARY_DISABLED
  }

  return (
    <AppButton
      {...props}
      loadingIconColor={loadingIconColor}
      backgroundColor={backgroundColor}
      iconColor={iconColor}
      textColor={textColor}
    />
  )
}
