import styled from 'styled-components/native'

import { AppButton } from 'ui/components/buttons/AppButton/AppButton'
import { BaseButtonProps } from 'ui/components/buttons/AppButton/types'
import { styledButton } from 'ui/components/buttons/styledButton'
import { Logo as InitialLoadingIndicator } from 'ui/svg/icons/Logo'
import { getSpacing, Typo } from 'ui/theme'

export const ButtonQuaternaryBlack = styledButton(AppButton).attrs<BaseButtonProps>(
  ({ icon, disabled, theme, ...rest }) => {
    let Icon

    if (icon) {
      Icon = styled(icon).attrs({
        color: theme.buttons.quaternaryBlack.iconColor,
        size: theme.buttons.quaternaryBlack.iconSize,
      })``
    }

    const LoadingIndicator = styled(InitialLoadingIndicator).attrs({
      color: theme.buttons.quaternaryBlack.loadingIconColor,
      size: theme.buttons.quaternaryBlack.iconSize,
    })``

    const Title = styled(Typo.ButtonText)({
      maxWidth: '100%',
      color: disabled
        ? theme.buttons.disabled.quaternaryBlack.textColor
        : theme.buttons.quaternaryBlack.textColor,
      fontSize: getSpacing(3),
      marginLeft: icon
        ? theme.buttons.quaternaryBlack.marginLeftWithIcon
        : theme.buttons.quaternaryBlack.marginLeft,
    })

    return {
      ...rest,
      icon: Icon,
      title: Title,
      loadingIndicator: LoadingIndicator,
      inlineHeight: getSpacing(5),
    }
  }
)(({ theme }) => ({
  backgroundColor: theme.buttons.quaternaryBlack.backgroundColor,
}))
