import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { AppButton, BaseButtonProps, TitleProps } from 'ui/components/buttons/AppButton'
import { Logo as InitialLoadingIndicator } from 'ui/svg/icons/Logo'
import { Typo } from 'ui/theme'

export const ButtonTertiaryWhite: FunctionComponent<BaseButtonProps> = (props) => {
  let Icon

  if (props.icon) {
    Icon = styled(props.icon).attrs(({ theme }) => ({
      color: props.disabled
        ? theme.buttons.disabled.tertiaryWhite.iconColor
        : theme.buttons.tertiaryWhite.iconColor,
      size: theme.buttons.tertiaryWhite.iconSize,
    }))``
  }

  const LoadingIndicator = styled(InitialLoadingIndicator).attrs(({ theme }) => ({
    color: theme.buttons.tertiaryWhite.loadingIconColor,
    size: theme.buttons.tertiaryWhite.iconSize,
  }))``

  const Title = styled(Typo.ButtonText)<TitleProps>(({ theme }) => ({
    maxWidth: '100%',
    color: props.disabled
      ? theme.buttons.disabled.tertiaryWhite.textColor
      : theme.buttons.tertiaryWhite.textColor,
    fontSize: props.textSize,
    marginLeft: props.icon
      ? theme.buttons.tertiaryWhite.marginLeftIcon
      : theme.buttons.tertiaryWhite.marginLeft,
  }))

  return <Button {...props} loadingIndicator={LoadingIndicator} icon={Icon} title={Title} />
}

const Button = styled(AppButton)(({ theme }) => ({
  backgroundColor: theme.buttons.tertiaryWhite.backgroundColor,
}))
