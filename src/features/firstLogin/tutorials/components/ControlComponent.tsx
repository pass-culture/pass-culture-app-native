import React from 'react'
import { TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'

import { ArrowNext } from 'ui/svg/icons/ArrowNext'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'

export type ControlComponentProps = {
  onPress: () => void
  title: string
  type: 'prev' | 'next'
}

const StyledTouchableOpacity = styled(TouchableOpacity)<{ type: string }>(({ type }) => ({
  [type === 'prev' ? 'marginLeft' : 'marginRight']: '50%',
  height: '100%',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
}))

export const ControlComponent = ({ onPress, title, type }: ControlComponentProps) => {
  return (
    <StyledTouchableOpacity
      accessibilityLabel={title}
      onPress={onPress}
      type={type}
      testID="button">
      {type === 'prev' ? (
        <ArrowPrevious testID="arrowPrevious" />
      ) : (
        <ArrowNext testID="arrowNext" />
      )}
    </StyledTouchableOpacity>
  )
}
