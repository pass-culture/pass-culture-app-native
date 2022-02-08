import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { AppButton } from 'ui/components/buttons/AppButton/AppButton'
import { BaseButtonProps } from 'ui/components/buttons/AppButton/types'
import { styledButton } from 'ui/components/buttons/styledButton'
import { Logo as InitialLoadingIndicator } from 'ui/svg/icons/Logo'
import { Typo } from 'ui/theme'

export const ButtonSecondaryWhite = styledButton(AppButton).attrs<BaseButtonProps>(
  ({ icon, disabled, textSize, theme, ...rest }) => {
    let Icon

    if (icon) {
      Icon = styled(icon).attrs({
        color: disabled
          ? theme.buttons.disabled.secondaryWhite.iconColor
          : theme.buttons.secondaryWhite.iconColor,
        size: theme.buttons.secondaryWhite.iconSize,
      })``
    }

    const Title = styled(Typo.ButtonText)({
      maxWidth: '100%',
      color: disabled
        ? theme.buttons.disabled.secondaryWhite.textColor
        : theme.buttons.secondaryWhite.textColor,
      fontSize: textSize,
      marginLeft: icon
        ? theme.buttons.secondaryWhite.marginLeftWithIcon
        : theme.buttons.secondaryWhite.marginLeft,
    })

    return {
      ...rest,
      icon: Icon,
      title: Title,
      loadingIndicator: LoadingIndicator,
    }
  }
)(({ theme, isLoading, disabled }) => {
  const backgroundColor = theme.buttons.secondaryWhite.backgroundColor
  const borderWidth = theme.buttons.secondaryWhite.borderWidth
  let borderColor = theme.buttons.secondaryWhite.borderColor

  if (isLoading) {
    borderColor = theme.buttons.loading.secondaryWhite.borderColor
  } else if (disabled) {
    borderColor = theme.buttons.disabled.secondaryWhite.borderColor
  }

  let webOnly = {}
  if (Platform.OS === 'web') {
    webOnly = {
      ['&:disabled']: {
        borderColor: theme.buttons.disabled.secondaryWhite.borderColor,
      },
    }
  }

  return {
    backgroundColor,
    borderColor,
    borderWidth,
    ...webOnly,
  }
})

const LoadingIndicator = styled(InitialLoadingIndicator).attrs(({ theme }) => ({
  color: theme.buttons.secondaryWhite.loadingIconColor,
  size: theme.buttons.secondaryWhite.iconSize,
}))``
