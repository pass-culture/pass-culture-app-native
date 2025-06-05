import styled from 'styled-components/native'

import { AppButton } from 'ui/components/buttons/AppButton/AppButton'
import { BaseButtonProps } from 'ui/components/buttons/AppButton/types'
import { styledButton } from 'ui/components/buttons/styledButton'
import { Logo as InitialLoadingIndicator } from 'ui/svg/icons/Logo'
import { Typo } from 'ui/theme'

export const ButtonTertiaryNeutralInfo = styledButton(AppButton).attrs<BaseButtonProps>(
  ({ icon, disabled, textSize, theme, ...rest }) => {
    let Icon

    if (icon) {
      Icon = styled(icon).attrs({
        color: disabled
          ? theme.designSystem.color.icon.disabled
          : theme.designSystem.color.icon.subtle,
        size: theme.buttons.tertiaryNeutralInfo.iconSize,
      })``
    }

    const Title = styled(Typo.Button)({
      maxWidth: '100%',
      color: disabled
        ? theme.designSystem.color.text.disabled
        : theme.designSystem.color.text.subtle,
      fontSize: textSize,
    })

    return {
      ...rest,
      loadingIndicator: LoadingIndicator,
      icon: Icon,
      title: Title,
      hoverUnderlineColor: theme.designSystem.color.text.subtle,
    }
  }
)({
  backgroundColor: 'transparent',
})

const LoadingIndicator = styled(InitialLoadingIndicator).attrs(({ theme }) => ({
  color: theme.buttons.tertiaryNeutralInfo.loadingIconColor,
  size: theme.buttons.tertiaryNeutralInfo.iconSize,
}))``
