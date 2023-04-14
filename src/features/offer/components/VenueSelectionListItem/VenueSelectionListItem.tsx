import React, { CSSProperties } from 'react'
import styled, { DefaultTheme } from 'styled-components/native'

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
      onMouseLeave={onMouseLeave}
      testID="venue-selection-list-item">
      <RadioWrapper isSelected={isSelected}>
        <RadioInner isSelected={isSelected} />
      </RadioWrapper>

      <InnerWrapper>
        <VenueDetails {...props} isHover={isHover} />
      </InnerWrapper>
    </Wrapper>
  )
}

const selectedStyles = (theme: DefaultTheme): CSSProperties => ({
  borderWidth: 2,
  borderColor: theme.colors.black,
  padding: getSpacing(4) - 1, // to avoid getting a jumping component
})

const unselectedStyles = (theme: DefaultTheme): CSSProperties => ({
  borderWidth: 1,
  borderColor: theme.colors.greySemiDark,
  padding: getSpacing(4),
})

const Wrapper = styled(TouchableOpacity)<{
  isFocus?: boolean
  isSelected?: boolean
}>(({ theme, isFocus, isSelected }) => {
  return {
    backgroundColor: theme.colors.white,
    borderRadius: getSpacing(2),
    borderStyle: 'solid',
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    ...customFocusOutline({ color: theme.colors.black, isFocus }),
    ...(isSelected ? selectedStyles(theme) : unselectedStyles(theme)),
  }
})

const InnerWrapper = styled.View({
  flex: 1,
})

const RadioWrapper = styled.View<{ isSelected?: boolean }>(({ theme, isSelected }) => ({
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

const RadioInner = styled.View<{ isSelected?: boolean }>(({ theme, isSelected }) => ({
  width: getSpacing(2),
  height: getSpacing(2),
  backgroundColor: isSelected ? theme.colors.primary : 'transparent',
  borderRadius: getSpacing(1),
}))
