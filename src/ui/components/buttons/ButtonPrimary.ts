import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { AppButton } from 'ui/components/buttons/AppButton/AppButton'
import { BaseButtonProps } from 'ui/components/buttons/AppButton/types'
import { styledButton } from 'ui/components/buttons/styledButton'
import { Logo as InitialLoadingIndicator } from 'ui/svg/icons/Logo'
import { TypoDS } from 'ui/theme'

export const ButtonPrimary = styledButton(AppButton).attrs<BaseButtonProps>(
  ({ isLoading, disabled, textSize, icon, theme, buttonHeight, ...rest }) => {
    let Icon

    if (icon) {
      Icon = styled(icon).attrs({
        color: disabled
          ? theme.designSystem.color.icon.disabled
          : theme.designSystem.color.text.inverted, // TODO(PC-35256): Use theme.designSystem.color.icon.inverted from design system
        size:
          buttonHeight === 'extraSmall'
            ? theme.icons.sizes.extraSmall
            : theme.buttons.primary.iconSize,
      })``
    }

    let backgroundColor: string = theme.designSystem.color.background['brand-primary']

    if (isLoading) {
      // TODO(PC-35256): Use theme.designSystem.color.primary.loading from design system
      backgroundColor = theme.buttons.loading.primary.backgroundColor
    } else if (disabled) {
      backgroundColor = theme.designSystem.color.background.disabled
    }

    const Title = styled(buttonHeight === 'extraSmall' ? TypoDS.BodyAccentXs : TypoDS.Button)({
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
      hoverUnderlineColor: theme.buttons.primary.textColor,
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
  color: theme.buttons.primary.loadingIconColor,
  size: theme.buttons.primary.iconSize,
}))``
