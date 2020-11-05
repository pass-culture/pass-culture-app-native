import React, { FunctionComponent } from 'react'

import { AppButton, BaseButtonProps } from 'ui/components/buttons/AppButton'
import { ColorsEnum } from 'ui/theme'

export const ButtonSecondary: FunctionComponent<BaseButtonProps> = (props) => {
  let textColor = ColorsEnum.PRIMARY
  const backgroundColor = ColorsEnum.TRANSPARENT
  let borderColor = ColorsEnum.PRIMARY
  const loadingIconColor = ColorsEnum.PRIMARY_DARK
  let iconColor = ColorsEnum.PRIMARY

  if (props.isLoading) {
    borderColor = ColorsEnum.PRIMARY_DARK
  } else if (props.disabled) {
    borderColor = textColor = iconColor = ColorsEnum.PRIMARY_DISABLED
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
