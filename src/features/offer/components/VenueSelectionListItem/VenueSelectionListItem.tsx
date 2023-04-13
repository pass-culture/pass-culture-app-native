import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { useHandleHover } from 'libs/hooks/useHandleHover'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { getSpacing } from 'ui/theme'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'

import { VenueDetails, VenueDetailsProps } from '../VenueDetails/VenueDetails'

export type VenueSelectionListItemProps = VenueDetailsProps & {
  isSelected?: boolean
  onSelect: VoidFunction
}

export function VenueSelectionListItem({
  onSelect,
  isSelected = false,
  ...props
}: VenueSelectionListItemProps) {
  const { onFocus, onBlur, isFocus } = useHandleFocus()
  const { onMouseEnter, onMouseLeave, isHover } = useHandleHover()

  return (
    <Wrapper
      activeOpacity={0.5}
      onFocus={onFocus}
      onBlur={onBlur}
      onPress={onSelect}
      isFocus={isFocus}
      isSelected={isSelected}
      // @ts-ignore It exists but not recognized by TypeScript
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}>
      <RadioWrapper isSelected={isSelected}>
        <RadioInner isSelected={isSelected} />
      </RadioWrapper>

      <InnerWrapper>
        <VenueDetails {...props} isHover={isHover} />
      </InnerWrapper>
    </Wrapper>
  )
}

const Wrapper = styled(TouchableOpacity)<{
  isFocus?: boolean
  isSelected?: boolean
}>(({ theme, isFocus, isSelected = false }) => ({
  backgroundColor: '#fff',
  borderRadius: getSpacing(2),
  borderWidth: isSelected ? 2 : 1,
  borderStyle: 'solid',
  borderColor: isSelected ? theme.colors.black : theme.colors.greySemiDark,
  padding: getSpacing(4) - (isSelected ? 1 : 0),
  flexDirection: 'row',
  alignItems: 'center',
  flexGrow: 1,
  ...customFocusOutline({ color: theme.colors.black, isFocus }),
}))

const InnerWrapper = styled(View)`
  flex: 1;
`

const RadioWrapper = styled(View)<{ isSelected?: boolean }>(({ theme, isSelected = false }) => ({
  width: getSpacing(4),
  height: getSpacing(4),
  borderRadius: getSpacing(2),
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: isSelected ? theme.colors.primary : theme.colors.greySemiDark,
  marginRight: getSpacing(4),
}))

const RadioInner = styled(View)<{ isSelected?: boolean }>(({ theme, isSelected = false }) => ({
  width: getSpacing(2),
  height: getSpacing(2),
  backgroundColor: isSelected ? theme.colors.primary : 'transparent',
  borderRadius: getSpacing(1),
}))
