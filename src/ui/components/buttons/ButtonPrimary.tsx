import styled from 'styled-components/native'

import { AppButton, BaseButtonProps } from 'ui/components/buttons/AppButton'
import { Logo as InitialLoadingIndicator } from 'ui/svg/icons/Logo'
import { Typo } from 'ui/theme'

export const ButtonPrimary = styled(AppButton).attrs<BaseButtonProps>(
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
      marginLeft: icon ? theme.buttons.primary.marginLeftIcon : theme.buttons.primary.marginLeft,
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
  }

  if (disabled) {
    backgroundColor = theme.buttons.disabled.primary.backgroundColor
  }

  return {
    backgroundColor,
  }
})

const LoadingIndicator = styled(InitialLoadingIndicator).attrs(({ theme }) => ({
  color: theme.buttons.primary.loadingIconColor,
  size: theme.buttons.primary.iconSize,
}))``
