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
  withMargin?: boolean
}

const StyledTouchable = styledButton(Touchable)<{ type: string; withMargin: boolean }>(
  ({ type, withMargin }) => ({
    ...(withMargin
      ? { ...(type === 'prev' ? { marginLeft: '70%' } : { marginRight: '70%' }) }
      : { margin: 0 }),
  })
)

export const ControlComponent = ({
  onPress,
  title,
  type,
  withMargin = false,
}: ControlComponentProps) => {
  return (
    <StyledTouchable
      onPress={onPress}
      withMargin={withMargin}
      type={type}
      accessibilityLabel={title}>
      {type === 'prev' ? (
        <ArrowPrevious testID="arrowPrevious" />
      ) : (
        <ArrowNext testID="arrowNext" />
      )}
    </StyledTouchable>
  )
}

const ArrowPrevious = styled(DefaultArrowPrevious).attrs(({ theme }) => ({
  size: theme.controlComponent.size,
}))``

const ArrowNext = styled(DefaultArrowNext).attrs(({ theme }) => ({
  size: theme.controlComponent.size,
}))``
