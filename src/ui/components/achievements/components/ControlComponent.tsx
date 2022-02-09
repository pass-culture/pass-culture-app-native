import React from 'react'
import { TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'

import { ArrowNext as DefaultArrowNext } from 'ui/svg/icons/ArrowNext'
import { ArrowPrevious as DefaultArrowPrevious } from 'ui/svg/icons/ArrowPrevious'

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

const ArrowPrevious = styled(DefaultArrowPrevious).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
}))``

const ArrowNext = styled(DefaultArrowNext).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
}))``
