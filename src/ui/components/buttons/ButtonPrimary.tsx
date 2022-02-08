import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { AppButton } from 'ui/components/buttons/AppButton/AppButton'
import { BaseButtonProps } from 'ui/components/buttons/AppButton/types'
import { styledButton } from 'ui/components/buttons/styledButton'
import { Logo as InitialLoadingIndicator } from 'ui/svg/icons/Logo'
import { Typo } from 'ui/theme'

export const ButtonPrimary = styledButton(AppButton).attrs<BaseButtonProps>(
  ({ disabled, textSize, icon, theme, ...rest }) => {
    let Icon

    if (icon) {
      Icon = styled(icon).attrs({
        color: theme.buttons.primary.iconColor,
        size: theme.buttons.primary.iconSize,
      })``
    }

    const Title = styled(Typo.ButtonText)({
      maxWidth: '100%',
      color: disabled ? theme.buttons.disabled.primary.textColor : theme.buttons.primary.textColor,
      fontSize: textSize,
      marginLeft: icon
        ? theme.buttons.primary.marginLeftWithIcon
        : theme.buttons.primary.marginLeft,
    })

    return {
      ...rest,
      loadingIndicator: LoadingIndicator,
      icon: Icon,
      title: Title,
    }
  }
)(({ theme, isLoading, disabled }) => {
  let backgroundColor = theme.buttons.primary.backgroundColor

  if (isLoading) {
    backgroundColor = theme.buttons.loading.primary.backgroundColor
  } else if (disabled) {
    backgroundColor = theme.buttons.disabled.primary.backgroundColor
  }

  let webOnly = {}
  if (Platform.OS === 'web') {
    webOnly = {
      ['&:disabled']: {
        backgroundColor: theme.buttons.disabled.primary.backgroundColor,
      },
    }
  }

  return {
    backgroundColor,
    ...webOnly,
  }
})

const LoadingIndicator = styled(InitialLoadingIndicator).attrs(({ theme }) => ({
  color: theme.buttons.primary.loadingIconColor,
  size: theme.buttons.primary.iconSize,
}))``
