import React from 'react'
import styled from 'styled-components/native'

import { AppButtonEventNative } from 'ui/components/buttons/AppButton/types'
import { ButtonInsideTextInner } from 'ui/components/buttons/buttonInsideText/ButtonInsideTextInner'
import { ButtonInsideTexteProps } from 'ui/components/buttons/buttonInsideText/types'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { getSpacing } from 'ui/theme'

export function ButtonInsideText({
  wording,
  typography = 'ButtonText',
  onPress,
  onLongPress,
  icon: Icon,
  color,
}: ButtonInsideTexteProps) {
  return (
    <StyledTouchableOpacity
      onPress={onPress as AppButtonEventNative}
      onLongPress={onLongPress as AppButtonEventNative}>
      <ButtonInsideTextInner wording={wording} icon={Icon} color={color} typography={typography} />
    </StyledTouchableOpacity>
  )
}

const StyledTouchableOpacity = styled(TouchableOpacity)({
  margin: -getSpacing(1 / 3), // Hack for reset default TouchableOpacity margin horizontal
})
