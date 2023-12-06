import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { AppButton } from 'ui/components/buttons/AppButton/AppButton'
import { BaseButtonProps } from 'ui/components/buttons/AppButton/types'
import { styledButton } from 'ui/components/buttons/styledButton'
import { Logo as InitialLoadingIndicator } from 'ui/svg/icons/Logo'
import { Typo } from 'ui/theme'

export const ButtonSecondaryBlack = styledButton(AppButton).attrs<BaseButtonProps>(
  ({ icon, disabled, textSize, theme, ...rest }) => {
    let Icon

    if (icon) {
      Icon = styled(icon).attrs({
        color: disabled
          ? theme.buttons.disabled.secondaryBlack.iconColor
          : theme.buttons.secondaryBlack.iconColor,
        size: theme.buttons.secondaryBlack.iconSize,
      })``
    }

    const Title = styled(Typo.ButtonText)({
      maxWidth: '100%',
      color: disabled
        ? theme.buttons.disabled.secondaryBlack.textColor
        : theme.buttons.secondaryBlack.textColor,
      fontSize: textSize,
      marginLeft: icon
        ? theme.buttons.secondaryBlack.marginLeftWithIcon
        : theme.buttons.secondaryBlack.marginLeft,
    })

    return {
      ...rest,
      icon: Icon,
      title: Title,
      loadingIndicator: LoadingIndicator,
      backgroundColor: theme.buttons.secondaryBlack.backgroundColor,
      hoverUnderlineColor: theme.buttons.secondaryBlack.textColor,
    }
  }
)(({ theme, isLoading, disabled }) => {
  const borderWidth = theme.buttons.secondaryBlack.borderWidth
  let borderColor: string = theme.buttons.secondaryBlack.borderColor

  if (isLoading) {
    borderColor = theme.buttons.loading.secondaryBlack.borderColor
  } else if (disabled) {
    borderColor = theme.buttons.disabled.secondaryBlack.borderColor
  }

  const webOnly =
    Platform.OS === 'web'
      ? {
          ['&:disabled']: {
            borderColor: theme.buttons.disabled.secondaryBlack.borderColor,
          },
        }
      : {}

  return {
    borderStyle: 'solid',
    borderColor,
    borderWidth,
    ...webOnly,
  }
})

const LoadingIndicator = styled(InitialLoadingIndicator).attrs(({ theme }) => ({
  color: theme.buttons.secondaryBlack.loadingIconColor,
  size: theme.buttons.secondaryBlack.iconSize,
}))``
