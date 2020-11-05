import React, { FunctionComponent } from 'react'

import { AppButton, BaseButtonProps } from 'ui/components/buttons/AppButton'
import { ColorsEnum } from 'ui/theme'

export const ButtonPrimary: FunctionComponent<BaseButtonProps> = (props) => {
  const textColor = ColorsEnum.WHITE
  const loadingIconColor = ColorsEnum.WHITE
  const iconColor = ColorsEnum.WHITE
  let backgroundColor = ColorsEnum.PRIMARY

  if (props.isLoading) {
    backgroundColor = ColorsEnum.PRIMARY_DARK
  } else if (props.disabled) {
    backgroundColor = ColorsEnum.PRIMARY_DISABLED
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
