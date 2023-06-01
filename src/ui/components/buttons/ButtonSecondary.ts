import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { AppButton } from 'ui/components/buttons/AppButton/AppButton'
import { BaseButtonProps } from 'ui/components/buttons/AppButton/types'
import { styledButton } from 'ui/components/buttons/styledButton'
import { Logo as InitialLoadingIndicator } from 'ui/svg/icons/Logo'
import { Typo } from 'ui/theme'

export const ButtonSecondary = styledButton(AppButton).attrs<BaseButtonProps>(
  ({ icon, disabled, textSize, theme, ...rest }) => {
    let Icon

    if (icon) {
      Icon = styled(icon).attrs({
        color: disabled
          ? theme.buttons.disabled.secondary.iconColor
          : theme.buttons.secondary.iconColor,
        size: theme.buttons.secondary.iconSize,
      })``
    }

    const Title = styled(Typo.ButtonText)({
      maxWidth: '100%',
      color: disabled
        ? theme.buttons.disabled.secondary.textColor
        : theme.buttons.secondary.textColor,
      fontSize: textSize,
      marginLeft: icon
        ? theme.buttons.secondary.marginLeftWithIcon
        : theme.buttons.secondary.marginLeft,
    })

    return {
      ...rest,
      icon: Icon,
      title: Title,
      loadingIndicator: LoadingIndicator,
      backgroundColor: theme.buttons.secondary.backgroundColor,
      hoverUnderlineColor: theme.buttons.secondary.textColor,
    }
  }
)(({ theme, isLoading, disabled }) => {
  const borderWidth = theme.buttons.secondary.borderWidth
  let borderColor = theme.buttons.secondary.borderColor

  if (isLoading) {
    borderColor = theme.buttons.loading.secondary.borderColor
  } else if (disabled) {
    borderColor = theme.buttons.disabled.secondary.borderColor
  }

  let webOnly = {}
  if (Platform.OS === 'web') {
    webOnly = {
      ['&:disabled']: {
        borderColor: theme.buttons.disabled.secondary.borderColor,
      },
    }
  }

  return {
    borderStyle: 'solid',
    borderColor,
    borderWidth,
    ...webOnly,
  }
})

const LoadingIndicator = styled(InitialLoadingIndicator).attrs(({ theme }) => ({
  color: theme.buttons.secondary.loadingIconColor,
  size: theme.buttons.secondary.iconSize,
}))``
