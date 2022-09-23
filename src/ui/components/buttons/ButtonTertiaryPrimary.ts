import styled from 'styled-components/native'

import { AppButton } from 'ui/components/buttons/AppButton/AppButton'
import { BaseButtonProps } from 'ui/components/buttons/AppButton/types'
import { styledButton } from 'ui/components/buttons/styledButton'
import { Logo as InitialLoadingIndicator } from 'ui/svg/icons/Logo'
import { Typo } from 'ui/theme'

export const ButtonTertiaryPrimary = styledButton(AppButton).attrs<BaseButtonProps>(
  ({ icon, disabled, textSize, theme, ...rest }) => {
    let Icon

    if (icon) {
      Icon = styled(icon).attrs({
        color: disabled
          ? theme.buttons.disabled.tertiary.iconColor
          : theme.buttons.tertiary.iconColor,
        size: theme.buttons.tertiary.iconSize,
      })``
    }

    const LoadingIndicator = styled(InitialLoadingIndicator).attrs({
      color: theme.buttons.tertiary.loadingIconColor,
      size: theme.buttons.tertiary.iconSize,
    })``

    const Title = styled(Typo.ButtonText)({
      maxWidth: '100%',
      color: disabled
        ? theme.buttons.disabled.tertiary.textColor
        : theme.buttons.tertiary.textColor,
      fontSize: textSize,
      marginLeft: icon
        ? theme.buttons.tertiary.marginLeftWithIcon
        : theme.buttons.tertiary.marginLeft,
    })

    return {
      ...rest,
      loadingIndicator: LoadingIndicator,
      icon: Icon,
      title: Title,
      hoverUnderlineColor: theme.buttons.tertiary.textColor,
    }
  }
)(({ theme }) => ({
  backgroundColor: theme.buttons.tertiary.backgroundColor,
}))
