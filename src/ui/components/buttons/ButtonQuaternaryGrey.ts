import styled from 'styled-components/native'

import { AppButton } from 'ui/components/buttons/AppButton/AppButton'
import { BaseButtonProps } from 'ui/components/buttons/AppButton/types'
import { styledButton } from 'ui/components/buttons/styledButton'
import { Logo as InitialLoadingIndicator } from 'ui/svg/icons/Logo'
import { getSpacing, Typo } from 'ui/theme'

export const ButtonQuaternaryGrey = styledButton(AppButton).attrs<BaseButtonProps>(
  ({ icon, disabled, theme, ...rest }) => {
    let Icon

    if (icon) {
      Icon = styled(icon).attrs({
        color: disabled
          ? theme.buttons.disabled.quaternaryGrey.iconColor
          : theme.buttons.quaternaryGrey.iconColor,
        size: theme.buttons.quaternaryGrey.iconSize,
      })``
    }

    const LoadingIndicator = styled(InitialLoadingIndicator).attrs({
      color: theme.buttons.quaternaryGrey.loadingIconColor,
      size: theme.buttons.quaternaryGrey.iconSize,
    })``

    const Title = styled(Typo.BodyAccentXs)({
      maxWidth: '100%',
      color: disabled
        ? theme.buttons.disabled.quaternaryGrey.textColor
        : theme.buttons.quaternaryGrey.textColor,
    })

    return {
      ...rest,
      inlineHeight: getSpacing(5),
      icon: Icon,
      loadingIndicator: LoadingIndicator,
      title: Title,
      hoverUnderlineColor: theme.buttons.quaternaryGrey.textColor,
    }
  }
)(({ theme }) => ({
  backgroundColor: theme.buttons.quaternaryGrey.backgroundColor,
}))
