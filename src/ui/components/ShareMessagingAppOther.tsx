import React from 'react'
import styled from 'styled-components/native'

import { IconWithCaption } from 'ui/components/IconWithCaption'
import { BicolorShare } from 'ui/svg/icons/BicolorShare'
import { TALL_BUTTON_HEIGHT, LINE_BREAK } from 'ui/theme/constants'

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
    <BicolorShare />
  </IconWrapper>
)

const IconWrapper = styled.View(({ theme }) => ({
  borderColor: theme.colors.greyMedium,
  borderWidth: 1,
  borderRadius: TALL_BUTTON_HEIGHT / 2,
  width: TALL_BUTTON_HEIGHT,
  height: TALL_BUTTON_HEIGHT,
  justifyContent: 'center',
  alignItems: 'center',
}))
