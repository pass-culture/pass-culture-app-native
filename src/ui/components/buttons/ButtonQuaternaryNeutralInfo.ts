import styled from 'styled-components/native'

import { AppButton } from 'ui/components/buttons/AppButton/AppButton'
import { BaseButtonProps } from 'ui/components/buttons/AppButton/types'
import { styledButton } from 'ui/components/buttons/styledButton'
import { Logo as InitialLoadingIndicator } from 'ui/svg/icons/Logo'
import { getSpacing, Typo } from 'ui/theme'

export const ButtonQuaternaryNeutralInfo = styledButton(AppButton).attrs<BaseButtonProps>(
  ({ icon, disabled, theme, ...rest }) => {
    let Icon

    if (icon) {
      Icon = styled(icon).attrs({
        color: disabled
          ? theme.buttons.disabled.quaternaryNeutralInfo.iconColor
          : theme.buttons.quaternaryNeutralInfo.iconColor,
        size: theme.buttons.quaternaryNeutralInfo.iconSize,
      })``
    }

    const LoadingIndicator = styled(InitialLoadingIndicator).attrs({
      color: theme.buttons.quaternaryNeutralInfo.loadingIconColor,
      size: theme.buttons.quaternaryNeutralInfo.iconSize,
    })``

    const Title = styled(Typo.Caption)({
      maxWidth: '100%',
      color: disabled
        ? theme.buttons.disabled.quaternaryNeutralInfo.textColor
        : theme.buttons.quaternaryNeutralInfo.textColor,
      marginLeft: icon
        ? theme.buttons.quaternaryNeutralInfo.marginLeftWithIcon
        : theme.buttons.quaternaryNeutralInfo.marginLeft,
    })

    return {
      ...rest,
      inlineHeight: getSpacing(5),
      icon: Icon,
      loadingIndicator: LoadingIndicator,
      title: Title,
      hoverUnderlineColor: theme.buttons.quaternaryNeutralInfo.textColor,
    }
  }
)(({ theme }) => ({
  backgroundColor: theme.buttons.quaternaryNeutralInfo.backgroundColor,
}))
