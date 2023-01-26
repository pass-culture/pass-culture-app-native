import React from 'react'
import styled from 'styled-components/native'

import { IconWithCaption } from 'ui/components/IconWithCaption'
import { BicolorShare } from 'ui/svg/icons/BicolorShare'
import { getSpacing } from 'ui/theme'
import { LINE_BREAK } from 'ui/theme/constants'

export const ShareMessagingAppOther: React.FC = () => {
  return (
    <IconWithCaption
      Icon={Icon}
      caption={'Plus' + LINE_BREAK + 'd’options'}
      accessibilityLabel="Plus d'options de partage"
    />
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
