import React from 'react'
import { LayoutChangeEvent, Platform, StyleProp, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { getSearchPropConfig } from 'features/navigation/navigators/SearchStackNavigator/getSearchPropConfig'
import { NativeCategoryEnum, SearchState } from 'features/search/types'
import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { useHandleHover } from 'libs/hooks/useHandleHover'
import { ColorsType } from 'theme/types'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Typo } from 'ui/theme'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'
import { getHoverStyle } from 'ui/theme/getHoverStyle/getHoverStyle'

const SUBCATEGORY_BUTTON_HEIGHT = 56
const SUBCATEGORY_BUTTON_WIDTH = 156

export type SubcategoryButtonItem = SubcategoryButtonProps & {
  nativeCategory: NativeCategoryEnum
}

type SubcategoryButtonProps = {
  label: string
  backgroundColor: ColorsType
  borderColor: ColorsType
  position?: number
  searchParams: SearchState
  onBeforeNavigate: VoidFunction
  onLayout?: (event: LayoutChangeEvent) => void
  uniformHeight?: number
  style?: StyleProp<ViewStyle>
  fullWidth?: boolean
}

export const SubcategoryButton = ({
  label,
  backgroundColor,
  borderColor,
  searchParams,
  onBeforeNavigate,
  onLayout,
  uniformHeight,
  style,
  fullWidth,
}: SubcategoryButtonProps) => {
  const focusProps = useHandleFocus()
  const hoverProps = useHandleHover()

  return (
    <StyledInternalTouchable
      {...focusProps}
      {...hoverProps}
      onMouseDown={(e: Event) => e.preventDefault()} // Prevent focus on click
      onBeforeNavigate={onBeforeNavigate}
      navigateTo={getSearchPropConfig('SearchResults', searchParams)}
      testID={`SubcategoryButton ${label}`}
      accessibilityLabel={label}
      backgroundColor={backgroundColor}
      borderColor={borderColor}
      onLayout={onLayout}
      uniformHeight={uniformHeight}
      fullWidth={fullWidth}
      style={style}>
      <StyledText>{label}</StyledText>
    </StyledInternalTouchable>
  )
}

const StyledInternalTouchable: typeof InternalTouchableLink = styled(InternalTouchableLink)<{
  isFocus?: boolean
  backgroundColor: ColorsType
  borderColor: ColorsType
  uniformHeight?: number
  fullWidth?: boolean
}>(({ theme, isFocus, backgroundColor, borderColor, uniformHeight, fullWidth }) => ({
  flexDirection: 'row',
  backgroundColor,
  width: fullWidth || !theme.isMobileViewport ? '100%' : SUBCATEGORY_BUTTON_WIDTH,
  minHeight: uniformHeight ?? SUBCATEGORY_BUTTON_HEIGHT,
  borderColor,
  borderWidth: 1.6,
  borderStyle: 'solid',
  borderRadius: theme.designSystem.size.borderRadius.m,
  ...customFocusOutline({ theme, isFocus }),
  textAlign: 'left',
  alignItems: 'center',
  paddingVertical: theme.designSystem.size.spacing.s,
  ...(Platform.OS === 'web' && { paddingHorizontal: theme.designSystem.size.spacing.s }),
}))

const StyledText = styled(Typo.BodyAccentXs).attrs({
  ellipsizeMode: 'tail',
  numberOfLines: 3,
})<{ isHover?: boolean }>(({ theme, isHover }) => ({
  marginHorizontal: Number(theme.designSystem.size.spacing.s),
  ...getHoverStyle({ underlineColor: theme.designSystem.color.text.default, isHover }),
}))
