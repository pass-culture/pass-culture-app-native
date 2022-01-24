import React, { FunctionComponent } from 'react'

import { AppButton, BaseButtonProps } from 'ui/components/buttons/AppButton'
import { getSpacing } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'
export const ButtonQuaternary: FunctionComponent<BaseButtonProps> = (props) => {
  let textColor = ColorsEnum.PRIMARY
  const backgroundColor = ColorsEnum.TRANSPARENT
  const loadingIconColor = ColorsEnum.PRIMARY_DARK
  let iconColor = ColorsEnum.PRIMARY

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
      iconSize={getSpacing(4)}
      inlineHeight={getSpacing(5)}
      textSize={getSpacing(3)}
    />
  )
}
