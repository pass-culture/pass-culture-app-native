import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { Typo } from 'ui/theme'

type ButtonWithCaptionProps = {
  onPress: () => void
  icon: FunctionComponent<AccessibleIcon>
  wording: string
  accessibilityLabel: string
  navigateTo?: InternalNavigationProps['navigateTo']
}

export const ButtonWithCaption: React.FC<ButtonWithCaptionProps> = ({
  onPress,
  icon: Icon,
  wording,
  accessibilityLabel,
  navigateTo,
}) => {
  const buttonProps = {
    icon: Icon,
    iconButton: true,
    accessibilityLabel,
    variant: 'tertiary',
    color: 'neutral',
  } as const

  return (
    <ButtonWithCaptionContainer gap={1.5}>
      {navigateTo ? (
        <InternalTouchableLink
          as={Button}
          navigateTo={navigateTo}
          onBeforeNavigate={onPress}
          {...buttonProps}
        />
      ) : (
        <Button onPress={onPress} {...buttonProps} />
      )}
      <ButtonCaption>{wording}</ButtonCaption>
    </ButtonWithCaptionContainer>
  )
}

const ButtonWithCaptionContainer = styled(ViewGap)({
  alignItems: 'center',
})

const ButtonCaption = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.lockedInverted,
  textAlign: 'center',
}))
