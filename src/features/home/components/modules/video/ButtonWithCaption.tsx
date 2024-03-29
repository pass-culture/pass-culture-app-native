import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { styledButton } from 'ui/components/buttons/styledButton'
import { Touchable } from 'ui/components/touchable/Touchable'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { Spacer, Typo, getSpacing } from 'ui/theme'

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
  return (
    <ButtonWithCaptionContainer>
      {navigateTo ? (
        <StyledTouchableLink
          navigateTo={navigateTo}
          onBeforeNavigate={onPress}
          accessibilityLabel={accessibilityLabel}>
          <Icon />
        </StyledTouchableLink>
      ) : (
        <StyledTouchable onPress={onPress} accessibilityLabel={accessibilityLabel}>
          <Icon />
        </StyledTouchable>
      )}
      <Spacer.Column numberOfSpaces={1.5} />
      <ButtonCaption>{wording}</ButtonCaption>
    </ButtonWithCaptionContainer>
  )
}

const ButtonWithCaptionContainer = styled.View({
  alignItems: 'center',
})

const ButtonCaption = styled(Typo.Caption)(({ theme }) => ({ color: theme.colors.white }))

const StyledTouchable = styledButton(Touchable)(({ theme }) => ({
  borderRadius: theme.buttons.roundedButton.size,
  padding: getSpacing(2.5),
  backgroundColor: theme.colors.white,
}))

const StyledTouchableLink = styled(InternalTouchableLink)(({ theme }) => ({
  borderRadius: theme.buttons.roundedButton.size,
  padding: getSpacing(2.5),
  backgroundColor: theme.colors.white,
}))
