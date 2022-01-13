import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { AppButton, BaseButtonProps, TitleProps } from 'ui/components/buttons/AppButton'
import { Logo as InitialLoadingIndicator } from 'ui/svg/icons/Logo'
import { getSpacing, Typo } from 'ui/theme'

export const ButtonQuaternary: FunctionComponent<BaseButtonProps> = (props) => {
  let Icon

  if (props.icon) {
    Icon = styled(props.icon).attrs(({ theme }) => ({
      color: props.disabled
        ? theme.buttons.disabled.quaternary.iconColor
        : theme.buttons.quaternary.iconColor,
      size: theme.buttons.quaternary.iconSize,
    }))``
  }

  const LoadingIndicator = styled(InitialLoadingIndicator).attrs(({ theme }) => ({
    color: theme.buttons.quaternary.loadingIconColor,
    size: theme.buttons.quaternary.iconSize,
  }))``

  const Title = styled(Typo.ButtonText)<TitleProps>(({ theme }) => ({
    maxWidth: '100%',
    color: props.disabled
      ? theme.buttons.disabled.quaternary.textColor
      : theme.buttons.quaternary.textColor,
    fontSize: getSpacing(3),
    marginLeft: props.icon
      ? theme.buttons.quaternary.marginLeftIcon
      : theme.buttons.quaternary.marginLeft,
  }))

  return (
    <Button
      {...props}
      inlineHeight={getSpacing(5)}
      icon={Icon}
      Title={Title}
      loadingIndicator={LoadingIndicator}
    />
  )
}

const Button = styled(AppButton)(({ theme }) => ({
  backgroundColor: theme.buttons.quaternary.backgroundColor,
}))
