import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { ColorsType } from 'theme/types'
import { AppButton } from 'ui/components/buttons/AppButton/AppButton'
import { BaseButtonProps } from 'ui/components/buttons/AppButton/types'
import { styledButton } from 'ui/components/buttons/styledButton'
import { Logo as InitialLoadingIndicator } from 'ui/svg/icons/Logo'
import { Typo } from 'ui/theme'

export const ButtonPrimary = styledButton(AppButton).attrs<BaseButtonProps>(
  ({ disabled, textSize, icon, theme, buttonHeight, ...rest }) => {
    let Icon

    if (icon) {
      Icon = styled(icon).attrs({
        color: disabled
          ? theme.designSystem.color.icon.disabled
          : theme.designSystem.color.icon.inverted,
        size:
          buttonHeight === 'extraSmall'
            ? theme.icons.sizes.extraSmall
            : theme.buttons.primary.iconSize,
      })``
    }

    let backgroundColor: ColorsType = theme.designSystem.color.background.brandPrimary

    if (disabled) {
      backgroundColor = theme.designSystem.color.background.disabled
    }

    const Title = styled(buttonHeight === 'extraSmall' ? Typo.BodyAccentXs : Typo.Button)({
      maxWidth: '100%',
      color: disabled
        ? theme.designSystem.color.text.disabled
        : theme.designSystem.color.text.inverted,
      fontSize: textSize,
    })

    return {
      ...rest,
      loadingIndicator: LoadingIndicator,
      icon: Icon,
      title: Title,
      backgroundColor,
      hoverUnderlineColor: theme.designSystem.color.text.inverted,
    }
  }
)(({ theme }) => {
  let webOnly = {}
  if (Platform.OS === 'web') {
    webOnly = {
      ['&:disabled']: {
        backgroundColor: theme.designSystem.color.background.disabled,
      },
    }
  }

  return {
    ...webOnly,
  }
})

const LoadingIndicator = styled(InitialLoadingIndicator).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.inverted,
  size: theme.buttons.primary.iconSize,
}))``
