import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { AppButton } from 'ui/components/buttons/AppButton/AppButton'
import { BaseButtonProps } from 'ui/components/buttons/AppButton/types'
import { styledButton } from 'ui/components/buttons/styledButton'
import { Logo as InitialLoadingIndicator } from 'ui/svg/icons/Logo'
import { TypoDS } from 'ui/theme'

export const ButtonSecondary = styledButton(AppButton).attrs<BaseButtonProps>(
  ({ icon, disabled, textSize, theme, color, ...rest }) => {
    let Icon
    const defaultColor = color ?? theme.designSystem.color.icon['brand-primary']
    if (icon) {
      Icon = styled(icon).attrs({
        color: disabled ? theme.designSystem.color.icon.disabled : defaultColor,
        size: theme.buttons.secondary.iconSize,
      })``
    }

    const Title = styled(TypoDS.Button)({
      maxWidth: '100%',
      color: disabled
        ? theme.designSystem.color.text.disabled
        : color ?? theme.designSystem.color.text['brand-primary'],
      fontSize: textSize,
    })

    return {
      ...rest,
      icon: Icon,
      title: Title,
      loadingIndicator: LoadingIndicator,
      backgroundColor: theme.designSystem.color.background.default,
      hoverUnderlineColor: color ?? theme.designSystem.color.text['brand-primary'],
    }
  }
)(({ theme, isLoading, disabled, color }) => {
  const borderWidth = theme.buttons.secondary.borderWidth
  let borderColor: string = color ?? theme.designSystem.color.border['brand-primary']

  if (isLoading) {
    // TODO(PC-35256): Use theme.designSystem.color.primary.loading from design system
    borderColor = theme.buttons.loading.secondary.borderColor
  } else if (disabled) {
    borderColor = theme.buttons.disabled.secondary.borderColor
  }

  const webOnly =
    Platform.OS === 'web'
      ? {
          ['&:disabled']: {
            borderColor: theme.designSystem.color.border.disabled,
          },
        }
      : {}

  return {
    borderStyle: 'solid',
    borderColor,
    borderWidth,
    ...webOnly,
  }
})

const LoadingIndicator = styled(InitialLoadingIndicator).attrs(({ theme }) => ({
  color: theme.buttons.secondary.loadingIconColor,
  size: theme.buttons.secondary.iconSize,
}))``
