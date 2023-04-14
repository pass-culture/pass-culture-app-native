import React from 'react'
import styled from 'styled-components/native'

import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { useHandleHover } from 'libs/hooks/useHandleHover'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { getSpacing } from 'ui/theme'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'

import { VenueDetails, VenueDetailsProps } from '../VenueDetails/VenueDetails'

export type VenueCardProps = VenueDetailsProps & {
  onPress: VoidFunction
}

export function VenueCard({ onPress, ...props }: VenueCardProps) {
  const { onFocus, onBlur, isFocus } = useHandleFocus()
  const { onMouseEnter, onMouseLeave, isHover } = useHandleHover()

  return (
    <Wrapper
      activeOpacity={0.5}
      onFocus={onFocus}
      onBlur={onBlur}
      onPress={onPress}
      isFocus={isFocus}
      // @ts-ignore It exists but not recognized by TypeScript
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}>
      <VenueDetails {...props} isHover={isHover} />
    </Wrapper>
  )
}

const Wrapper = styled(TouchableOpacity)<{
  isFocus?: boolean
}>(({ theme, isFocus }) => ({
  backgroundColor: theme.colors.white,
  borderRadius: getSpacing(2),
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: theme.colors.greySemiDark,
  padding: getSpacing(4),
  ...customFocusOutline({ color: theme.colors.black, isFocus }),
}))
