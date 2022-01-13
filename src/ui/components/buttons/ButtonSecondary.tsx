import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { AppButton, BaseButtonProps, TitleProps } from 'ui/components/buttons/AppButton'
import { Logo as InitialLoadingIndicator } from 'ui/svg/icons/Logo'
import { Typo } from 'ui/theme'

export const ButtonSecondary: FunctionComponent<BaseButtonProps> = (props) => {
  let Icon

  if (props.icon) {
    Icon = styled(props.icon).attrs(({ theme }) => ({
      color: props.disabled
        ? theme.buttons.disabled.secondary.iconColor
        : theme.buttons.secondary.iconColor,
      size: theme.buttons.secondary.iconSize,
    }))``
  }

  const Title = styled(Typo.ButtonText)<TitleProps>(({ theme }) => ({
    maxWidth: '100%',
    color: props.disabled
      ? theme.buttons.disabled.secondary.textColor
      : theme.buttons.secondary.textColor,
    fontSize: props.textSize,
    marginLeft: props.icon
      ? theme.buttons.secondary.marginLeftIcon
      : theme.buttons.secondary.marginLeft,
  }))

  return <Button {...props} icon={Icon} Title={Title} loadingIndicator={LoadingIndicator} />
}

const Button = styled(AppButton)(({ theme, isLoading, disabled }) => ({
  backgroundColor: theme.buttons.secondary.backgroundColor,
  borderColor: theme.buttons.secondary.borderColor,
  borderWidth: theme.buttons.secondary.borderWidth,
  ...(isLoading
    ? {
        borderColor: theme.buttons.loading.secondary.borderColor,
      }
    : {}),
  ...(disabled
    ? {
        borderColor: theme.buttons.disabled.secondary.borderColor,
      }
    : {}),
}))

const LoadingIndicator = styled(InitialLoadingIndicator).attrs(({ theme }) => ({
  color: theme.buttons.secondary.loadingIconColor,
  size: theme.buttons.secondary.iconSize,
}))``
