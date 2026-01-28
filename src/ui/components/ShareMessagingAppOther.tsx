import React from 'react'
import styled from 'styled-components/native'

import { IconWithCaption } from 'ui/components/IconWithCaption'
import { MessagingAppButtonContainer } from 'ui/components/ShareMessagingApp'
import { Share } from 'ui/svg/icons/Share'
import { LINE_BREAK } from 'ui/theme/constants'

interface ShareMessagingAppOtherProps {
  onPress: () => void
}

export const ShareMessagingAppOther: React.FC<ShareMessagingAppOtherProps> = ({ onPress }) => {
  return (
    <MessagingAppButtonContainer onPress={onPress} accessibilityLabel="Plus d’options de partage">
      <IconWithCaption Icon={Icon} caption={'Plus' + LINE_BREAK + 'd’options'} />
    </MessagingAppButtonContainer>
  )
}

const Icon = () => (
  <IconWrapper>
    <StyledShare />
  </IconWrapper>
)

const StyledShare = styled(Share)(({ theme }) => ({
  size: theme.designSystem.size.spacing.xxl,
}))

const IconWrapper = styled.View(({ theme }) => ({
  borderColor: theme.designSystem.color.border.subtle,
  borderWidth: 1,
  borderRadius: theme.designSystem.size.borderRadius.xl,
  width: theme.buttons.buttonHeights.tall,
  height: theme.buttons.buttonHeights.tall,
  justifyContent: 'center',
  alignItems: 'center',
}))
