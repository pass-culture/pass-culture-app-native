import styled from 'styled-components/native'

import { AppButton } from 'ui/components/buttons/AppButton/AppButton'
import { BaseButtonProps } from 'ui/components/buttons/AppButton/types'
import { styledButton } from 'ui/components/buttons/styledButton'
import { Logo as InitialLoadingIndicator } from 'ui/svg/icons/Logo'
import { Typo } from 'ui/theme'

export const ButtonTertiaryWhite = styledButton(AppButton).attrs<BaseButtonProps>(
  ({ disabled, icon, textSize, theme, ...rest }) => {
    let Icon

    if (icon) {
      Icon = styled(icon).attrs({
        color: disabled
          ? theme.buttons.disabled.tertiaryWhite.iconColor
          : theme.buttons.tertiaryWhite.iconColor,
        size: theme.buttons.tertiaryWhite.iconSize,
      })``
    }

    const LoadingIndicator = styled(InitialLoadingIndicator).attrs({
      color: theme.buttons.tertiaryWhite.loadingIconColor,
      size: theme.buttons.tertiaryWhite.iconSize,
    })``

    const Title = styled(Typo.ButtonText)({
      maxWidth: '100%',
      color: disabled
        ? theme.buttons.disabled.tertiaryWhite.textColor
        : theme.buttons.tertiaryWhite.textColor,
      fontSize: textSize,
      marginLeft: icon
        ? theme.buttons.tertiaryWhite.marginLeftWithIcon
        : theme.buttons.tertiaryWhite.marginLeft,
    })

    return {
      ...rest,
      loadingIndicator: LoadingIndicator,
      icon: Icon,
      title: Title,
    }
  }
)(({ theme }) => ({
  backgroundColor: theme.buttons.tertiaryWhite.backgroundColor,
}))
