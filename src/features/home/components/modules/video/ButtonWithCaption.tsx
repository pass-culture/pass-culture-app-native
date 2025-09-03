import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { styledButton } from 'ui/components/buttons/styledButton'
import { Touchable } from 'ui/components/touchable/Touchable'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { Typo, getSpacing } from 'ui/theme'

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
    <ButtonWithCaptionContainer gap={1.5}>
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

const StyledTouchable = styledButton(Touchable)(({ theme }) => ({
  borderRadius: theme.designSystem.size.borderRadius.pill,
  padding: getSpacing(2.5),
  backgroundColor: theme.designSystem.color.background.locked,
}))

const StyledTouchableLink = styled(InternalTouchableLink)(({ theme }) => ({
  borderRadius: theme.designSystem.size.borderRadius.pill,
  padding: getSpacing(2.5),
  backgroundColor: theme.designSystem.color.background.locked,
}))
