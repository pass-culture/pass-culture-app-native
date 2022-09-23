import styled from 'styled-components/native'

import { AppButton } from 'ui/components/buttons/AppButton/AppButton'
import { BaseButtonProps } from 'ui/components/buttons/AppButton/types'
import { styledButton } from 'ui/components/buttons/styledButton'
import { Logo as InitialLoadingIndicator } from 'ui/svg/icons/Logo'
import { getSpacing, Typo } from 'ui/theme'

export const ButtonTertiarySecondary = styledButton(AppButton).attrs<BaseButtonProps>(
  ({ icon, disabled, textSize, theme, ...rest }) => {
    let Icon

    if (icon) {
      Icon = styled(icon).attrs({
        color: disabled
          ? theme.buttons.disabled.tertiarySecondary.iconColor
          : theme.buttons.tertiarySecondary.iconColor,
        size: theme.buttons.tertiarySecondary.iconSize,
      })``
    }

    const Title = styled(Typo.ButtonText)({
      maxWidth: '100%',
      color: disabled
        ? theme.buttons.disabled.tertiarySecondary.textColor
        : theme.buttons.tertiarySecondary.textColor,
      fontSize: textSize,
      marginLeft: icon
        ? theme.buttons.tertiarySecondary.marginLeftWithIcon
        : theme.buttons.tertiarySecondary.marginLeft,
    })

    return {
      ...rest,
      loadingIndicator: LoadingIndicator,
      icon: Icon,
      title: Title,
      inlineHeight: getSpacing(5),
      hoverUnderlineColor: theme.buttons.tertiarySecondary.textColor,
    }
  }
)(({ theme }) => ({
  backgroundColor: theme.buttons.tertiarySecondary.backgroundColor,
}))

const LoadingIndicator = styled(InitialLoadingIndicator).attrs(({ theme }) => ({
  color: theme.buttons.tertiarySecondary.loadingIconColor,
  size: theme.buttons.tertiarySecondary.iconSize,
}))``
