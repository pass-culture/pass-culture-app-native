import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { AppButton } from 'ui/components/buttons/AppButton/AppButton'
import { BaseButtonProps } from 'ui/components/buttons/AppButton/types'
import { styledButton } from 'ui/components/buttons/styledButton'
import { Logo as InitialLoadingIndicator } from 'ui/svg/icons/Logo'
import { getSpacing, Typo } from 'ui/theme'

export const ButtonPrimary = styledButton(AppButton).attrs<BaseButtonProps>(
  ({ isLoading, disabled, textSize, icon, theme, buttonHeight, ...rest }) => {
    let Icon

    if (icon) {
      Icon = styled(icon).attrs({
        color: disabled
          ? theme.buttons.disabled.primary.iconColor
          : theme.buttons.primary.iconColor,
        size:
          buttonHeight === 'extraSmall'
            ? theme.icons.sizes.extraSmall
            : theme.buttons.primary.iconSize,
      })``
    }

    let backgroundColor: string = theme.buttons.primary.backgroundColor

    if (isLoading) {
      backgroundColor = theme.buttons.loading.primary.backgroundColor
    } else if (disabled) {
      backgroundColor = theme.buttons.disabled.primary.backgroundColor
    }

    const marginLeftWithIcon = () => {
      if (buttonHeight === 'extraSmall') return getSpacing(1)
      return theme.buttons.primary.marginLeftWithIcon
    }

    const Title = styled(buttonHeight !== 'extraSmall' ? Typo.ButtonText : Typo.Caption)({
      maxWidth: '100%',
      color: disabled ? theme.buttons.disabled.primary.textColor : theme.buttons.primary.textColor,
      fontSize: textSize,
      marginLeft: icon ? marginLeftWithIcon() : theme.buttons.primary.marginLeft,
    })

    return {
      ...rest,
      loadingIndicator: LoadingIndicator,
      icon: Icon,
      title: Title,
      backgroundColor,
      hoverUnderlineColor: theme.buttons.primary.textColor,
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
  color: theme.buttons.primary.loadingIconColor,
  size: theme.buttons.primary.iconSize,
}))``
