import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { AppButton } from 'ui/components/buttons/AppButton/AppButton'
import { BaseButtonProps } from 'ui/components/buttons/AppButton/types'
import { styledButton } from 'ui/components/buttons/styledButton'
import { Logo as InitialLoadingIndicator } from 'ui/svg/icons/Logo'
import { Typo } from 'ui/theme'

export const ButtonPrimaryBlack = styledButton(AppButton).attrs<BaseButtonProps>(
  ({ disabled, icon, textSize, theme, ...rest }) => {
    let Icon

    if (icon) {
      Icon = styled(icon).attrs({
        color: disabled
          ? theme.buttons.disabled.primaryBlack.iconColor
          : theme.buttons.primaryBlack.iconColor,
        size: theme.buttons.primaryBlack.iconSize,
      })``
    }

    const Title = styled(Typo.ButtonText)({
      maxWidth: '100%',
      color: disabled
        ? theme.buttons.disabled.primaryBlack.textColor
        : theme.buttons.primaryBlack.textColor,
      fontSize: textSize,
    })

    return {
      ...rest,
      loadingIndicator: LoadingIndicator,
      icon: Icon,
      title: Title,
      focusOutlineColor:
        Platform.OS === 'web' ? theme.buttons.primaryBlack.outlineColor : undefined,
      hoverUnderlineColor: theme.buttons.primaryBlack.textColor,
      backgroundColor: theme.buttons.primaryBlack.backgroundColor,
    }
  }
)(({ theme }) => {
  let webOnly = {}
  if (Platform.OS === 'web') {
    webOnly = {
      ['&:disabled']: {
        backgroundColor: theme.buttons.disabled.primary.backgroundColor,
      },
    }
  }

  return {
    ...webOnly,
  }
})

const LoadingIndicator = styled(InitialLoadingIndicator).attrs(({ theme }) => ({
  color: theme.buttons.primaryBlack.loadingIconColor,
  size: theme.buttons.primaryBlack.iconSize,
}))``
