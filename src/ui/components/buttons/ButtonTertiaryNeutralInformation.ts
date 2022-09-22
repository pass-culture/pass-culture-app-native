import styled from 'styled-components/native'

import { AppButton } from 'ui/components/buttons/AppButton/AppButton'
import { BaseButtonProps } from 'ui/components/buttons/AppButton/types'
import { styledButton } from 'ui/components/buttons/styledButton'
import { Logo as InitialLoadingIndicator } from 'ui/svg/icons/Logo'
import { Typo } from 'ui/theme'

export const ButtonTertiaryNeutralInformation = styledButton(AppButton).attrs<BaseButtonProps>(
  ({ icon, disabled, textSize, theme, ...rest }) => {
    let Icon

    if (icon) {
      Icon = styled(icon).attrs({
        color: disabled
          ? theme.buttons.disabled.tertiaryNeutralInformation.iconColor
          : theme.buttons.tertiaryNeutralInformation.iconColor,
        size: theme.buttons.tertiaryNeutralInformation.iconSize,
      })``
    }

    const Title = styled(Typo.ButtonText)({
      maxWidth: '100%',
      color: disabled
        ? theme.buttons.disabled.tertiaryNeutralInformation.textColor
        : theme.buttons.tertiaryNeutralInformation.textColor,
      fontSize: textSize,
      marginLeft: icon
        ? theme.buttons.tertiaryNeutralInformation.marginLeftWithIcon
        : theme.buttons.tertiaryNeutralInformation.marginLeft,
    })

    return {
      ...rest,
      loadingIndicator: LoadingIndicator,
      icon: Icon,
      title: Title,
      hoverUnderlineColor: theme.buttons.tertiaryNeutralInformation.textColor,
    }
  }
)(({ theme }) => ({
  backgroundColor: theme.buttons.tertiaryNeutralInformation.backgroundColor,
}))

const LoadingIndicator = styled(InitialLoadingIndicator).attrs(({ theme }) => ({
  color: theme.buttons.tertiaryNeutralInformation.loadingIconColor,
  size: theme.buttons.tertiaryNeutralInformation.iconSize,
}))``
