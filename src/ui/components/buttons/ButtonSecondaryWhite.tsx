import styled from 'styled-components/native'

import { AppButton, BaseButtonProps } from 'ui/components/buttons/AppButton'
import { Logo as InitialLoadingIndicator } from 'ui/svg/icons/Logo'
import { Typo } from 'ui/theme'

export const ButtonSecondaryWhite = styled(AppButton).attrs<BaseButtonProps>(
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

  return {
    backgroundColor,
    borderColor,
    borderWidth,
  }
})

const LoadingIndicator = styled(InitialLoadingIndicator).attrs(({ theme }) => ({
  color: theme.buttons.secondaryWhite.loadingIconColor,
  size: theme.buttons.secondaryWhite.iconSize,
}))``
