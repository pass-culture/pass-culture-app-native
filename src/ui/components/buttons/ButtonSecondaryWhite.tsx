import React, { FunctionComponent } from 'react'

import { AppButton, BaseButtonProps } from 'ui/components/buttons/AppButton'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

export const ButtonSecondaryWhite: FunctionComponent<BaseButtonProps> = (props) => {
  let textColor = ColorsEnum.WHITE
  const backgroundColor = ColorsEnum.TRANSPARENT
  let borderColor = ColorsEnum.WHITE
  const loadingIconColor = ColorsEnum.PRIMARY_DARK
  let iconColor = ColorsEnum.WHITE

  if (props.isLoading) {
    borderColor = ColorsEnum.PRIMARY_DARK
  } else if (props.disabled) {
    borderColor = textColor = iconColor = ColorsEnum.GREY_DARK
  }

  return (
    <AppButton
      {...props}
      loadingIconColor={loadingIconColor}
      backgroundColor={backgroundColor}
      iconColor={iconColor}
      textColor={textColor}
      borderColor={borderColor}
    />
  )
}
