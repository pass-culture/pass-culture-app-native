import styled from 'styled-components/native'

import { AppButton, BaseButtonProps } from 'ui/components/buttons/AppButton'
import { Logo as InitialLoadingIndicator } from 'ui/svg/icons/Logo'
import { Typo } from 'ui/theme'

export const ButtonSecondary = styled(AppButton).attrs<BaseButtonProps>(
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
        ? theme.buttons.secondary.marginLeftIcon
        : theme.buttons.secondary.marginLeft,
    })

    return {
      ...rest,
      icon: Icon,
      title: Title,
      loadingIndicator: LoadingIndicator,
    }
  }
)(({ theme, isLoading, disabled }) => {
  const backgroundColor = theme.buttons.secondary.backgroundColor
  const borderWidth = theme.buttons.secondary.borderWidth
  let borderColor = theme.buttons.secondary.borderColor

  if (isLoading) {
    borderColor = theme.buttons.loading.secondary.borderColor
  }

  if (disabled) {
    borderColor = theme.buttons.disabled.secondary.borderColor
  }

  return {
    backgroundColor,
    borderColor,
    borderWidth,
  }
})

const LoadingIndicator = styled(InitialLoadingIndicator).attrs(({ theme }) => ({
  color: theme.buttons.secondary.loadingIconColor,
  size: theme.buttons.secondary.iconSize,
}))``
