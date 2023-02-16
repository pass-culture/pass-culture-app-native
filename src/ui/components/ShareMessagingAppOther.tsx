import React from 'react'
import styled from 'styled-components/native'

import { IconWithCaption } from 'ui/components/IconWithCaption'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { BicolorShare } from 'ui/svg/icons/BicolorShare'
import { getSpacing } from 'ui/theme'
import { LINE_BREAK } from 'ui/theme/constants'

interface ShareMessagingAppOtherProps {
  onPress: () => void
}

export const ShareMessagingAppOther: React.FC<ShareMessagingAppOtherProps> = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <IconWithCaption
        Icon={Icon}
        caption={'Plus' + LINE_BREAK + 'd’options'}
        accessibilityLabel="Plus d’options de partage"
      />
    </TouchableOpacity>
  )
}

const Icon = () => (
  <IconWrapper>
    <BicolorShare size={getSpacing(7)} />
  </IconWrapper>
)

const IconWrapper = styled.View(({ theme }) => ({
  borderColor: theme.colors.greyMedium,
  borderWidth: 1,
  borderRadius: theme.buttons.buttonHeights.tall / 2,
  width: theme.buttons.buttonHeights.tall,
  height: theme.buttons.buttonHeights.tall,
  justifyContent: 'center',
  alignItems: 'center',
}))
