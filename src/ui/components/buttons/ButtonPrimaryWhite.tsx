import styled from 'styled-components/native'

import { AppButton, BaseButtonProps } from 'ui/components/buttons/AppButton'
import { Logo as InitialLoadingIndicator } from 'ui/svg/icons/Logo'
import { Typo } from 'ui/theme'

export const ButtonPrimaryWhite = styled(AppButton).attrs<BaseButtonProps>(
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
      marginLeft: icon
        ? theme.buttons.primaryWhite.marginLeftIcon
        : theme.buttons.primaryWhite.marginLeft,
    })

    return {
      ...rest,
      loadingIndicator: LoadingIndicator,
      icon: Icon,
      title: Title,
    }
  }
)(({ theme }) => ({
  backgroundColor: theme.buttons.primaryWhite.backgroundColor,
}))

const LoadingIndicator = styled(InitialLoadingIndicator).attrs(({ theme }) => ({
  color: theme.buttons.primaryWhite.loadingIconColor,
  size: theme.buttons.primaryWhite.iconSize,
}))``
