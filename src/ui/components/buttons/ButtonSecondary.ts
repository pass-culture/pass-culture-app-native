import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { AppButton } from 'ui/components/buttons/AppButton/AppButton'
import { BaseButtonProps } from 'ui/components/buttons/AppButton/types'
import { styledButton } from 'ui/components/buttons/styledButton'
import { Logo as InitialLoadingIndicator } from 'ui/svg/icons/Logo'
import { Typo } from 'ui/theme'

export const ButtonSecondary = styledButton(AppButton).attrs<BaseButtonProps>(
  ({ icon, disabled, textSize, theme, color, ...rest }) => {
    let Icon
    const defaultColor = color ?? theme.designSystem.color.icon.brandSecondary
    if (icon) {
      Icon = styled(icon).attrs({
        color: disabled ? theme.designSystem.color.icon.disabled : defaultColor,
        size: theme.buttons.secondary.iconSize,
      })``
    }

    const Title = styled(Typo.Button)({
      maxWidth: '100%',
      color: disabled
        ? theme.designSystem.color.text.disabled
        : (color ?? theme.designSystem.color.text.brandSecondary),
      fontSize: textSize,
    })

    return {
      ...rest,
      icon: Icon,
      title: Title,
      loadingIndicator: LoadingIndicator,
      backgroundColor: theme.designSystem.color.background.default,
      hoverUnderlineColor: color ?? theme.designSystem.color.text.brandSecondary,
    }
  }
)(({ theme, disabled, color }) => {
  const borderWidth = theme.buttons.secondary.borderWidth
  let borderColor = color ?? theme.designSystem.color.border.brandSecondary

  if (disabled) {
    borderColor = theme.designSystem.color.border.disabled
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
  color: theme.designSystem.color.icon.brandSecondary,
  size: theme.buttons.secondary.iconSize,
}))``
