import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { AppButton, BaseButtonProps, TitleProps } from 'ui/components/buttons/AppButton'
import { Logo as InitialLoadingIndicator } from 'ui/svg/icons/Logo'
import { Typo } from 'ui/theme'

export const ButtonTertiaryBlack: FunctionComponent<BaseButtonProps> = (props) => {
  let Icon

  if (props.icon) {
    Icon = styled(props.icon).attrs(({ theme }) => ({
      color: props.disabled
        ? theme.buttons.disabled.tertiaryBlack.iconColor
        : theme.buttons.tertiaryBlack.iconColor,
      size: theme.buttons.tertiaryBlack.iconSize,
    }))``
  }

  const Title = styled(Typo.ButtonText)<TitleProps>(({ theme }) => ({
    maxWidth: '100%',
    color: props.disabled
      ? theme.buttons.disabled.tertiaryBlack.textColor
      : theme.buttons.tertiaryBlack.textColor,
    fontSize: props.textSize,
    marginLeft: props.icon
      ? theme.buttons.tertiaryBlack.marginLeftIcon
      : theme.buttons.tertiaryBlack.marginLeft,
  }))

  return (
    <Button
      {...props}
      loadingIndicator={LoadingIndicator}
      icon={Icon}
      Title={Title}
      inlineHeight={20}
    />
  )
}

const Button = styled(AppButton)(({ theme }) => ({
  backgroundColor: theme.buttons.tertiaryBlack.backgroundColor,
}))

const LoadingIndicator = styled(InitialLoadingIndicator).attrs(({ theme }) => ({
  color: theme.buttons.tertiaryBlack.loadingIconColor,
  size: theme.buttons.tertiaryBlack.iconSize,
}))``
