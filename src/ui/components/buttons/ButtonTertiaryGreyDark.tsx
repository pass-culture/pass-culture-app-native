import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { AppButton, BaseButtonProps, TitleProps } from 'ui/components/buttons/AppButton'
import { Logo as InitialLoadingIndicator } from 'ui/svg/icons/Logo'
import { Typo } from 'ui/theme'

export const ButtonTertiaryGreyDark: FunctionComponent<BaseButtonProps> = (props) => {
  let Icon

  if (props.icon) {
    Icon = styled(props.icon).attrs(({ theme }) => ({
      color: props.disabled
        ? theme.buttons.disabled.tertiaryGreyDark.iconColor
        : theme.buttons.tertiaryGreyDark.iconColor,
      size: theme.buttons.tertiaryGreyDark.iconSize,
    }))``
  }

  const Title = styled(Typo.ButtonText)<TitleProps>(({ theme }) => ({
    maxWidth: '100%',
    color: props.disabled
      ? theme.buttons.disabled.tertiaryGreyDark.textColor
      : theme.buttons.tertiaryGreyDark.textColor,
    fontSize: props.textSize,
    marginLeft: props.icon
      ? theme.buttons.tertiaryGreyDark.marginLeftIcon
      : theme.buttons.tertiaryGreyDark.marginLeft,
  }))

  return <Button {...props} loadingIndicator={LoadingIndicator} icon={Icon} Title={Title} />
}

const Button = styled(AppButton)(({ theme }) => ({
  backgroundColor: theme.buttons.tertiaryGreyDark.backgroundColor,
}))

const LoadingIndicator = styled(InitialLoadingIndicator).attrs(({ theme }) => ({
  color: theme.buttons.tertiaryGreyDark.loadingIconColor,
  size: theme.buttons.tertiaryGreyDark.iconSize,
}))``
