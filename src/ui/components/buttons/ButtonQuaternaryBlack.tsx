import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { AppButton, BaseButtonProps, TitleProps } from 'ui/components/buttons/AppButton'
import { Logo as InitialLoadingIndicator } from 'ui/svg/icons/Logo'
import { getSpacing, Typo } from 'ui/theme'

export const ButtonQuaternaryBlack: FunctionComponent<BaseButtonProps> = (props) => {
  let Icon

  if (props.icon) {
    Icon = styled(props.icon).attrs(({ theme }) => ({
      color: theme.buttons.quaternaryBlack.iconColor,
      size: theme.buttons.quaternaryBlack.iconSize,
    }))``
  }

  const LoadingIndicator = styled(InitialLoadingIndicator).attrs(({ theme }) => ({
    color: theme.buttons.quaternaryBlack.loadingIconColor,
    size: theme.buttons.quaternaryBlack.iconSize,
  }))``

  const Title = styled(Typo.ButtonText)<TitleProps>(({ theme }) => ({
    maxWidth: '100%',
    color: props.disabled
      ? theme.buttons.disabled.quaternaryBlack.textColor
      : theme.buttons.quaternaryBlack.textColor,
    fontSize: getSpacing(3),
    marginLeft: props.icon
      ? theme.buttons.quaternaryBlack.marginLeftIcon
      : theme.buttons.quaternaryBlack.marginLeft,
  }))

  return (
    <Button
      {...props}
      loadingIndicator={LoadingIndicator}
      icon={Icon}
      Title={Title}
      inlineHeight={getSpacing(5)}
    />
  )
}

const Button = styled(AppButton)(({ theme }) => ({
  backgroundColor: theme.buttons.quaternaryBlack.backgroundColor,
}))
