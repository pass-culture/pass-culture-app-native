import styled from 'styled-components/native'

import { AppButton } from 'ui/components/buttons/AppButton/AppButton'
import { BaseButtonProps } from 'ui/components/buttons/AppButton/types'
import { styledButton } from 'ui/components/buttons/styledButton'
import { Logo as InitialLoadingIndicator } from 'ui/svg/icons/Logo'
import { getSpacing, Typo } from 'ui/theme'

export const ButtonQuaternarySecondary = styledButton(AppButton).attrs<BaseButtonProps>(
  ({ icon, disabled, theme, ...rest }) => {
    let Icon

    if (icon) {
      Icon = styled(icon).attrs({
        color: disabled
          ? theme.buttons.disabled.quaternarySecondary.iconColor
          : theme.buttons.quaternarySecondary.iconColor,
        size: theme.buttons.quaternarySecondary.iconSize,
      })``
    }

    const LoadingIndicator = styled(InitialLoadingIndicator).attrs({
      color: theme.buttons.quaternarySecondary.loadingIconColor,
      size: theme.buttons.quaternarySecondary.iconSize,
    })``

    const Title = styled(Typo.Caption)({
      maxWidth: '100%',
      color: disabled
        ? theme.buttons.disabled.quaternarySecondary.textColor
        : theme.buttons.quaternarySecondary.textColor,
      marginLeft: icon
        ? theme.buttons.quaternarySecondary.marginLeftWithIcon
        : theme.buttons.quaternarySecondary.marginLeft,
    })

    return {
      ...rest,
      inlineHeight: getSpacing(5),
      icon: Icon,
      loadingIndicator: LoadingIndicator,
      title: Title,
      hoverUnderlineColor: theme.buttons.quaternarySecondary.textColor,
    }
  }
)(({ theme }) => ({
  backgroundColor: theme.buttons.quaternarySecondary.backgroundColor,
}))
