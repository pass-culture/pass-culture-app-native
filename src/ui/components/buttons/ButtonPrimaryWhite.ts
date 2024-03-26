import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { AppButton } from 'ui/components/buttons/AppButton/AppButton'
import { BaseButtonProps } from 'ui/components/buttons/AppButton/types'
import { styledButton } from 'ui/components/buttons/styledButton'
import { Logo as InitialLoadingIndicator } from 'ui/svg/icons/Logo'
import { Typo } from 'ui/theme'

export const ButtonPrimaryWhite = styledButton(AppButton).attrs<BaseButtonProps>(
  ({ disabled, icon, textSize, theme, ...rest }) => {
    let Icon

    if (icon) {
      Icon = styled(icon).attrs({
        color: disabled
          ? theme.buttons.disabled.primaryWhite.iconColor
          : theme.buttons.primaryWhite.iconColor,
        size: theme.buttons.primaryWhite.iconSize,
      })``
    }

    const Title = styled(Typo.ButtonText)({
      maxWidth: '100%',
      color: disabled
        ? theme.buttons.disabled.primaryWhite.textColor
        : theme.buttons.primaryWhite.textColor,
      fontSize: textSize,
    })

    return {
      ...rest,
      loadingIndicator: LoadingIndicator,
      icon: Icon,
      title: Title,
      focusOutlineColor:
        Platform.OS === 'web' ? theme.buttons.primaryWhite.outlineColor : undefined,
      hoverUnderlineColor: theme.buttons.primaryWhite.textColor,
      backgroundColor: theme.buttons.primaryWhite.backgroundColor,
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
  color: theme.buttons.primaryWhite.loadingIconColor,
  size: theme.buttons.primaryWhite.iconSize,
}))``
