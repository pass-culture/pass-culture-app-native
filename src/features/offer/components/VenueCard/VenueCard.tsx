import React from 'react'
import styled from 'styled-components/native'

import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { useHandleHover } from 'libs/hooks/useHandleHover'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { BicolorArrowRight } from 'ui/svg/icons/BicolorArrowRight'
import { getSpacing } from 'ui/theme'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'

import { VenueDetails, VenueDetailsProps } from '../VenueDetails/VenueDetails'

export type VenueCardProps = Omit<VenueDetailsProps, 'isHover'> & {
  onPress: VoidFunction
}

export function VenueCard({ onPress, ...props }: VenueCardProps) {
  const { onFocus, onBlur, isFocus } = useHandleFocus()
  const { onMouseEnter, onMouseLeave, isHover } = useHandleHover()

  return (
    <Wrapper
      testID="venue-card"
      activeOpacity={0.5}
      onFocus={onFocus}
      onBlur={onBlur}
      onPress={onPress}
      isFocus={isFocus}
      // @ts-ignore It exists but not recognized by TypeScript
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}>
      <VenueDetails {...props} isHover={isHover} />
      <ArrowWrapper>
        <ArrowCircleBox>
          <StyledArrowRight />
        </ArrowCircleBox>
      </ArrowWrapper>
    </Wrapper>
  )
}

const Wrapper = styled(TouchableOpacity)<{
  isFocus?: boolean
}>(({ theme, isFocus }) => ({
  maxWidth: getSpacing(125),
  display: 'flex',
  flexDirection: 'row',
  backgroundColor: theme.colors.white,
  borderRadius: getSpacing(2),
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: theme.colors.greySemiDark,
  padding: getSpacing(4),
  ...customFocusOutline({ color: theme.colors.black, isFocus }),
}))

const ArrowWrapper = styled.View({
  justifyContent: 'flex-end',
})

const ArrowCircleBox = styled.View({
  backgroundColor: 'black',
  borderRadius: 50,
  width: getSpacing(6),
  height: getSpacing(6),
  justifyContent: 'center',
  alignItems: 'center',
})

const StyledArrowRight = styled(BicolorArrowRight).attrs(({ theme }) => ({
  color: theme.colors.white,
  size: theme.icons.sizes.extraSmall,
}))``
