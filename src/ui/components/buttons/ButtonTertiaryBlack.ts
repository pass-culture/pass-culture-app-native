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
          ? theme.designSystem.color.icon.disabled
          : theme.designSystem.color.icon.default,
        color2: disabled
          ? theme.designSystem.color.icon.disabled
          : theme.designSystem.color.icon.inverted,
        size:
          buttonHeight === 'extraSmall'
            ? theme.icons.sizes.extraSmall
            : theme.buttons.tertiaryBlack.iconSize,
      })``
    }

    const Title = styled(Typo.Button)({
      maxWidth: '100%',
      color: disabled
        ? theme.designSystem.color.text.disabled
        : theme.designSystem.color.text.default,
      fontSize: textSize,
    })
    return {
      ...rest,
      loadingIndicator: LoadingIndicator,
      icon: Icon,
      title: Title,
      inlineHeight: getSpacing(5),
      hoverUnderlineColor: theme.designSystem.color.text.default,
    }
  }
)({
  backgroundColor: 'transparent',
})

const LoadingIndicator = styled(InitialLoadingIndicator).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.default,
  size: theme.buttons.tertiaryBlack.iconSize,
}))``
