import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { AppButton, BaseButtonProps, TitleProps } from 'ui/components/buttons/AppButton'
import { Logo as InitialLoadingIndicator } from 'ui/svg/icons/Logo'
import { Typo } from 'ui/theme'

export const ButtonPrimaryWhite: FunctionComponent<BaseButtonProps> = (props) => {
  let Icon

  if (props.icon) {
    Icon = styled(props.icon).attrs(({ theme }) => ({
      color: props.disabled
        ? theme.buttons.disabled.primaryWhite.iconColor
        : theme.buttons.primaryWhite.iconColor,
      size: theme.buttons.primaryWhite.iconSize,
    }))``
  }

  const Title = styled(Typo.ButtonText)<TitleProps>(({ theme }) => ({
    maxWidth: '100%',
    color: props.disabled
      ? theme.buttons.disabled.primaryWhite.textColor
      : theme.buttons.primaryWhite.textColor,
    fontSize: props.textSize,
    marginLeft: props.icon
      ? theme.buttons.primaryWhite.marginLeftIcon
      : theme.buttons.primaryWhite.marginLeft,
  }))

  return <Button {...props} loadingIndicator={LoadingIndicator} icon={Icon} Title={Title} />
}

const Button = styled(AppButton)(({ theme }) => ({
  backgroundColor: theme.buttons.primaryWhite.backgroundColor,
}))

const LoadingIndicator = styled(InitialLoadingIndicator).attrs(({ theme }) => ({
  color: theme.buttons.primaryWhite.loadingIconColor,
  size: theme.buttons.primaryWhite.iconSize,
}))``
