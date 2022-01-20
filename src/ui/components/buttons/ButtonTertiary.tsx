import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { AppButton, BaseButtonProps, TitleProps } from 'ui/components/buttons/AppButton'
import { Logo as InitialLoadingIndicator } from 'ui/svg/icons/Logo'
import { Typo } from 'ui/theme'

export const ButtonTertiary: FunctionComponent<BaseButtonProps> = (props) => {
  let Icon

  if (props.icon) {
    Icon = styled(props.icon).attrs(({ theme }) => ({
      color: props.disabled
        ? theme.buttons.disabled.tertiary.iconColor
        : theme.buttons.tertiary.iconColor,
      size: theme.buttons.tertiary.iconSize,
    }))``
  }

  const LoadingIndicator = styled(InitialLoadingIndicator).attrs(({ theme }) => ({
    color: theme.buttons.tertiary.loadingIconColor,
    size: theme.buttons.tertiary.iconSize,
  }))``

  const Title = styled(Typo.ButtonText)<TitleProps>(({ theme }) => ({
    maxWidth: '100%',
    color: props.disabled
      ? theme.buttons.disabled.tertiary.textColor
      : theme.buttons.tertiary.textColor,
    fontSize: props.textSize,
    marginLeft: props.icon
      ? theme.buttons.tertiary.marginLeftIcon
      : theme.buttons.tertiary.marginLeft,
  }))

  return <Button {...props} loadingIndicator={LoadingIndicator} icon={Icon} title={Title} />
}

const Button = styled(AppButton)(({ theme }) => ({
  backgroundColor: theme.buttons.tertiary.backgroundColor,
}))
