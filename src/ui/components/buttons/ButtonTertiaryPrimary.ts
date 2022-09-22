import styled from 'styled-components/native'

import { AppButton } from 'ui/components/buttons/AppButton/AppButton'
import { BaseButtonProps } from 'ui/components/buttons/AppButton/types'
import { styledButton } from 'ui/components/buttons/styledButton'
import { Logo as InitialLoadingIndicator } from 'ui/svg/icons/Logo'
import { getSpacing, Typo } from 'ui/theme'

export const ButtonTertiaryPrimary = styledButton(AppButton).attrs<BaseButtonProps>(
  ({ icon, disabled, textSize, theme, ...rest }) => {
    let Icon

    if (icon) {
      Icon = styled(icon).attrs({
        color: disabled
          ? theme.buttons.disabled.tertiaryPrimary.iconColor
          : theme.buttons.tertiaryPrimary.iconColor,
        size: theme.buttons.tertiaryPrimary.iconSize,
      })``
    }

    const Title = styled(Typo.ButtonText)({
      maxWidth: '100%',
      color: disabled
        ? theme.buttons.disabled.tertiaryPrimary.textColor
        : theme.buttons.tertiaryPrimary.textColor,
      fontSize: textSize,
      marginLeft: icon
        ? theme.buttons.tertiaryPrimary.marginLeftWithIcon
        : theme.buttons.tertiaryPrimary.marginLeft,
    })

    return {
      ...rest,
      loadingIndicator: LoadingIndicator,
      icon: Icon,
      title: Title,
      inlineHeight: getSpacing(5),
      hoverUnderlineColor: theme.buttons.tertiaryPrimary.textColor,
    }
  }
)(({ theme }) => ({
  backgroundColor: theme.buttons.tertiaryPrimary.backgroundColor,
}))

const LoadingIndicator = styled(InitialLoadingIndicator).attrs(({ theme }) => ({
  color: theme.buttons.tertiaryPrimary.loadingIconColor,
  size: theme.buttons.tertiaryPrimary.iconSize,
}))``
