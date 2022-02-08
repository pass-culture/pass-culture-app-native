import styled from 'styled-components/native'

import { AppButton } from 'ui/components/buttons/AppButton/AppButton'
import { BaseButtonProps } from 'ui/components/buttons/AppButton/types'
import { styledButton } from 'ui/components/buttons/styledButton'
import { Logo as InitialLoadingIndicator } from 'ui/svg/icons/Logo'
import { Typo } from 'ui/theme'

export const ButtonTertiaryGreyDark = styledButton(AppButton).attrs<BaseButtonProps>(
  ({ icon, disabled, textSize, theme, ...rest }) => {
    let Icon

    if (icon) {
      Icon = styled(icon).attrs({
        color: disabled
          ? theme.buttons.disabled.tertiaryGreyDark.iconColor
          : theme.buttons.tertiaryGreyDark.iconColor,
        size: theme.buttons.tertiaryGreyDark.iconSize,
      })``
    }

    const Title = styled(Typo.ButtonText)({
      maxWidth: '100%',
      color: disabled
        ? theme.buttons.disabled.tertiaryGreyDark.textColor
        : theme.buttons.tertiaryGreyDark.textColor,
      fontSize: textSize,
      marginLeft: icon
        ? theme.buttons.tertiaryGreyDark.marginLeftWithIcon
        : theme.buttons.tertiaryGreyDark.marginLeft,
    })

    return {
      ...rest,
      loadingIndicator: LoadingIndicator,
      icon: Icon,
      title: Title,
    }
  }
)(({ theme }) => ({
  backgroundColor: theme.buttons.tertiaryGreyDark.backgroundColor,
}))

const LoadingIndicator = styled(InitialLoadingIndicator).attrs(({ theme }) => ({
  color: theme.buttons.tertiaryGreyDark.loadingIconColor,
  size: theme.buttons.tertiaryGreyDark.iconSize,
}))``
