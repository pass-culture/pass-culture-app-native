import styled from 'styled-components/native'

import { AppButton } from 'ui/components/buttons/AppButton/AppButton'
import { BaseButtonProps } from 'ui/components/buttons/AppButton/types'
import { styledButton } from 'ui/components/buttons/styledButton'
import { Logo as InitialLoadingIndicator } from 'ui/svg/icons/Logo'
import { getSpacing, Typo } from 'ui/theme'

export const ButtonQuaternaryPrimary = styledButton(AppButton).attrs<BaseButtonProps>(
  ({ icon, disabled, theme, ...rest }) => {
    let Icon

    if (icon) {
      Icon = styled(icon).attrs({
        color: disabled
          ? theme.buttons.disabled.quaternaryPrimary.iconColor
          : theme.buttons.quaternaryPrimary.iconColor,
        size: theme.buttons.quaternaryPrimary.iconSize,
      })``
    }

    const LoadingIndicator = styled(InitialLoadingIndicator).attrs({
      color: theme.buttons.quaternaryPrimary.loadingIconColor,
      size: theme.buttons.quaternaryPrimary.iconSize,
    })``

    const Title = styled(Typo.Caption)({
      maxWidth: '100%',
      color: disabled
        ? theme.buttons.disabled.quaternaryPrimary.textColor
        : theme.buttons.quaternaryPrimary.textColor,
      marginLeft: icon
        ? theme.buttons.quaternaryPrimary.marginLeftWithIcon
        : theme.buttons.quaternaryPrimary.marginLeft,
    })

    return {
      ...rest,
      inlineHeight: getSpacing(5),
      icon: Icon,
      loadingIndicator: LoadingIndicator,
      title: Title,
      hoverUnderlineColor: theme.buttons.quaternaryPrimary.textColor,
    }
  }
)(({ theme }) => ({
  backgroundColor: theme.buttons.quaternaryPrimary.backgroundColor,
}))
