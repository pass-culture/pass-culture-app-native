import React from 'react'
import styled from 'styled-components/native'

import { styledButton } from 'ui/components/buttons/styledButton'
import { Touchable } from 'ui/components/touchable/Touchable'
import { ArrowNext as DefaultArrowNext } from 'ui/svg/icons/ArrowNext'
import { ArrowPrevious as DefaultArrowPrevious } from 'ui/svg/icons/ArrowPrevious'

export type ControlComponentProps = {
  onPress: () => void
  title: string
  type: 'prev' | 'next'
}

const StyledTouchable = styledButton(Touchable)<{ type: string }>(({ type }) => ({
  [type === 'prev' ? 'marginLeft' : 'marginRight']: '70%',
}))

export const ControlComponent = ({ onPress, title, type }: ControlComponentProps) => {
  return (
    <StyledTouchable
      accessibilityLabel={title}
      onPress={onPress}
      type={type}
      testID="controlButton">
      {type === 'prev' ? (
        <ArrowPrevious testID="arrowPrevious" />
      ) : (
        <ArrowNext testID="arrowNext" />
      )}
    </StyledTouchable>
  )
}

const ArrowPrevious = styled(DefaultArrowPrevious).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
}))``

const ArrowNext = styled(DefaultArrowNext).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
}))``
