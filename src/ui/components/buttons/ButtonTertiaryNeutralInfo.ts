import styled from 'styled-components/native'

import { AppButton } from 'ui/components/buttons/AppButton/AppButton'
import { BaseButtonProps } from 'ui/components/buttons/AppButton/types'
import { styledButton } from 'ui/components/buttons/styledButton'
import { Logo as InitialLoadingIndicator } from 'ui/svg/icons/Logo'
import { TypoDS } from 'ui/theme'

export const ButtonTertiaryNeutralInfo = styledButton(AppButton).attrs<BaseButtonProps>(
  ({ icon, disabled, textSize, theme, ...rest }) => {
    let Icon

    if (icon) {
      Icon = styled(icon).attrs({
        color: disabled
          ? theme.buttons.disabled.tertiaryNeutralInfo.iconColor
          : theme.buttons.tertiaryNeutralInfo.iconColor,
        size: theme.buttons.tertiaryNeutralInfo.iconSize,
      })``
    }

    const Title = styled(TypoDS.Button)({
      maxWidth: '100%',
      color: disabled
        ? theme.buttons.disabled.tertiaryNeutralInfo.textColor
        : theme.buttons.tertiaryNeutralInfo.textColor,
      fontSize: textSize,
    })

    return {
      ...rest,
      loadingIndicator: LoadingIndicator,
      icon: Icon,
      title: Title,
      hoverUnderlineColor: theme.buttons.tertiaryNeutralInfo.textColor,
    }
  }
)(({ theme }) => ({
  backgroundColor: theme.buttons.tertiaryNeutralInfo.backgroundColor,
}))

const LoadingIndicator = styled(InitialLoadingIndicator).attrs(({ theme }) => ({
  color: theme.buttons.tertiaryNeutralInfo.loadingIconColor,
  size: theme.buttons.tertiaryNeutralInfo.iconSize,
}))``
