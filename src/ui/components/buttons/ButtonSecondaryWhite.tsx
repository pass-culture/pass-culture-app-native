import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { AppButton, BaseButtonProps, TitleProps } from 'ui/components/buttons/AppButton'
import { Logo as InitialLoadingIndicator } from 'ui/svg/icons/Logo'
import { Typo } from 'ui/theme'

export const ButtonSecondaryWhite: FunctionComponent<BaseButtonProps> = (props) => {
  let Icon

  if (props.icon) {
    Icon = styled(props.icon).attrs(({ theme }) => ({
      color: props.disabled
        ? theme.buttons.disabled.secondaryWhite.iconColor
        : theme.buttons.secondaryWhite.iconColor,
      size: theme.buttons.secondaryWhite.iconSize,
    }))``
  }

  const Title = styled(Typo.ButtonText)<TitleProps>(({ theme }) => ({
    maxWidth: '100%',
    color: props.disabled
      ? theme.buttons.disabled.secondaryWhite.textColor
      : theme.buttons.secondaryWhite.textColor,
    fontSize: props.textSize,
    marginLeft: props.icon
      ? theme.buttons.secondaryWhite.marginLeftIcon
      : theme.buttons.secondaryWhite.marginLeft,
  }))

  return <Button {...props} icon={Icon} Title={Title} loadingIndicator={LoadingIndicator} />
}

const Button = styled(AppButton)(({ theme, isLoading, disabled }) => ({
  backgroundColor: theme.buttons.secondaryWhite.backgroundColor,
  borderColor: theme.buttons.secondaryWhite.borderColor,
  borderWidth: theme.buttons.secondaryWhite.borderWidth,
  ...(isLoading
    ? {
        borderColor: theme.buttons.loading.secondaryWhite.borderColor,
      }
    : {}),
  ...(disabled
    ? {
        borderColor: theme.buttons.disabled.secondaryWhite.borderColor,
      }
    : {}),
}))

const LoadingIndicator = styled(InitialLoadingIndicator).attrs(({ theme }) => ({
  color: theme.buttons.secondaryWhite.loadingIconColor,
  size: theme.buttons.secondaryWhite.iconSize,
}))``
