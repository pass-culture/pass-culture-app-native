import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { AppButton, BaseButtonProps, TitleProps } from 'ui/components/buttons/AppButton'
import { Logo as InitialLoadingIndicator } from 'ui/svg/icons/Logo'
import { Typo } from 'ui/theme'

export const ButtonPrimary: FunctionComponent<BaseButtonProps> = (props) => {
  let Icon

  if (props.icon) {
    Icon = styled(props.icon).attrs(({ theme }) => ({
      color: theme.buttons.primary.iconColor,
      size: theme.buttons.primary.iconSize,
    }))``
  }

  const Title = styled(Typo.ButtonText)<TitleProps>(({ theme }) => ({
    maxWidth: '100%',
    color: props.disabled
      ? theme.buttons.disabled.primary.textColor
      : theme.buttons.primary.textColor,
    fontSize: props.textSize,
    marginLeft: props.icon
      ? theme.buttons.primary.marginLeftIcon
      : theme.buttons.primary.marginLeft,
  }))

  return <Button {...props} loadingIndicator={LoadingIndicator} icon={Icon} title={Title} />
}

const Button = styled(AppButton)(({ theme, isLoading, disabled }) => ({
  backgroundColor: theme.buttons.primary.backgroundColor,
  ...(isLoading
    ? {
        backgroundColor: theme.buttons.loading.primary.backgroundColor,
      }
    : {}),
  ...(disabled
    ? {
        backgroundColor: theme.buttons.disabled.primary.backgroundColor,
      }
    : {}),
}))

const LoadingIndicator = styled(InitialLoadingIndicator).attrs(({ theme }) => ({
  color: theme.buttons.primary.loadingIconColor,
  size: theme.buttons.primary.iconSize,
}))``
