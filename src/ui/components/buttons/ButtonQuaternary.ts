import styled from 'styled-components/native'

import { AppButton } from 'ui/components/buttons/AppButton/AppButton'
import { BaseButtonProps } from 'ui/components/buttons/AppButton/types'
import { styledButton } from 'ui/components/buttons/styledButton'
import { Logo as InitialLoadingIndicator } from 'ui/svg/icons/Logo'
import { getSpacing, Typo } from 'ui/theme'

export const ButtonQuaternary = styledButton(AppButton).attrs<BaseButtonProps>(
  ({ icon, disabled, theme, ...rest }) => {
    let Icon

    if (icon) {
      Icon = styled(icon).attrs({
        color: disabled
          ? theme.buttons.disabled.quaternary.iconColor
          : theme.buttons.quaternary.iconColor,
        size: theme.buttons.quaternary.iconSize,
      })``
    }

    const LoadingIndicator = styled(InitialLoadingIndicator).attrs({
      color: theme.buttons.quaternary.loadingIconColor,
      size: theme.buttons.quaternary.iconSize,
    })``

    const Title = styled(Typo.Caption)({
      maxWidth: '100%',
      color: disabled
        ? theme.buttons.disabled.quaternary.textColor
        : theme.buttons.quaternary.textColor,
      marginLeft: icon
        ? theme.buttons.quaternary.marginLeftWithIcon
        : theme.buttons.quaternary.marginLeft,
    })

    return {
      ...rest,
      inlineHeight: getSpacing(5),
      icon: Icon,
      loadingIndicator: LoadingIndicator,
      title: Title,
      hoverUnderlineColor: theme.buttons.quaternary.textColor,
    }
  }
)(({ theme }) => ({
  backgroundColor: theme.buttons.quaternary.backgroundColor,
}))
