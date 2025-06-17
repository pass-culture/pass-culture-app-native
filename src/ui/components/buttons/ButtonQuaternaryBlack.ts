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
        color: disabled
          ? theme.designSystem.color.icon.disabled
          : theme.designSystem.color.icon.default,
        size: theme.buttons.quaternaryBlack.iconSize,
      })``
    }

    const LoadingIndicator = styled(InitialLoadingIndicator).attrs({
      color: theme.designSystem.color.icon.default,
      size: theme.buttons.quaternaryBlack.iconSize,
    })``

    const Title = styled(Typo.BodyAccentXs)({
      maxWidth: '100%',
      color: disabled
        ? theme.designSystem.color.text.disabled
        : theme.designSystem.color.text.default,
    })

    return {
      ...rest,
      inlineHeight: getSpacing(5),
      icon: Icon,
      loadingIndicator: LoadingIndicator,
      title: Title,
      hoverUnderlineColor: theme.designSystem.color.text.default,
    }
  }
)({
  backgroundColor: 'transparent',
})
