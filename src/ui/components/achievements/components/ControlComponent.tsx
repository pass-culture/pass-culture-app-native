import React from 'react'
import { TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'

import { ArrowNextDeprecated as ArrowNext } from 'ui/svg/icons/ArrowNext_deprecated'
import { ArrowPreviousDeprecated as ArrowPrevious } from 'ui/svg/icons/ArrowPrevious_deprecated'

export type ControlComponentProps = {
  onPress: () => void
  title: string
  type: 'prev' | 'next'
}

const StyledTouchableOpacity = styled(TouchableOpacity)<{ type: string }>(({ type }) => ({
  [type === 'prev' ? 'marginLeft' : 'marginRight']: '70%',
}))

export const ControlComponent = ({ onPress, title, type }: ControlComponentProps) => {
  return (
    <StyledTouchableOpacity
      accessibilityLabel={title}
      onPress={onPress}
      type={type}
      testID="controlButton">
      {type === 'prev' ? (
        <ArrowPrevious testID="arrowPrevious" />
      ) : (
        <ArrowNext testID="arrowNext" />
      )}
    </StyledTouchableOpacity>
  )
}
