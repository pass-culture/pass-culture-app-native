import styled from 'styled-components/native'

import { AppButton } from 'ui/components/buttons/AppButton/AppButton'
import { BaseButtonProps } from 'ui/components/buttons/AppButton/types'
import { styledButton } from 'ui/components/buttons/styledButton'
import { Logo as InitialLoadingIndicator } from 'ui/svg/icons/Logo'
import { getSpacing, Typo } from 'ui/theme'

export const ButtonTertiaryBlack = styledButton(AppButton).attrs<BaseButtonProps>(
  ({ icon, disabled, textSize, theme, buttonHeight, ...rest }) => {
    let Icon

    if (icon) {
      Icon = styled(icon).attrs({
        color: disabled
          ? theme.buttons.disabled.tertiaryBlack.iconColor
          : theme.buttons.tertiaryBlack.iconColor,
        size:
          buttonHeight === 'extraSmall'
            ? theme.icons.sizes.extraSmall
            : theme.buttons.tertiaryBlack.iconSize,
      })``
    }

    const Title = styled(Typo.ButtonText)({
      maxWidth: '100%',
      color: disabled
        ? theme.buttons.disabled.tertiaryBlack.textColor
        : theme.buttons.tertiaryBlack.textColor,
      fontSize: textSize,
      marginLeft: icon
        ? theme.buttons.tertiaryBlack.marginLeftWithIcon
        : theme.buttons.tertiaryBlack.marginLeft,
    })

    return {
      ...rest,
      loadingIndicator: LoadingIndicator,
      icon: Icon,
      title: Title,
      inlineHeight: getSpacing(5),
      hoverUnderlineColor: theme.buttons.tertiaryBlack.textColor,
    }
  }
)(({ theme }) => ({
  backgroundColor: theme.buttons.tertiaryBlack.backgroundColor,
}))

const LoadingIndicator = styled(InitialLoadingIndicator).attrs(({ theme }) => ({
  color: theme.buttons.tertiaryBlack.loadingIconColor,
  size: theme.buttons.tertiaryBlack.iconSize,
}))``
