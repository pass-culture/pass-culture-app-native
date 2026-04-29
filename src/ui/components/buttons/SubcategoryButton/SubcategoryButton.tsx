import React from 'react'
import { LayoutChangeEvent, Platform } from 'react-native'
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

export const SUBCATEGORY_BUTTON_HEIGHT = 56
export const SUBCATEGORY_BUTTON_WIDTH = 156

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
}

export const SubcategoryButton = ({
  label,
  backgroundColor,
  borderColor,
  searchParams,
  onBeforeNavigate,
  onLayout,
  uniformHeight,
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
      uniformHeight={uniformHeight}>
      <StyledText>{label}</StyledText>
    </StyledInternalTouchable>
  )
}

const StyledInternalTouchable: typeof InternalTouchableLink = styled(InternalTouchableLink)<{
  isFocus?: boolean
  backgroundColor: ColorsType
  borderColor: ColorsType
  uniformHeight?: number
}>(({ theme, isFocus, backgroundColor, borderColor, uniformHeight }) => ({
  flexDirection: 'row',
  backgroundColor,
  width: theme.isMobileViewport ? SUBCATEGORY_BUTTON_WIDTH : '100%',
  minHeight: uniformHeight ?? SUBCATEGORY_BUTTON_HEIGHT,
  borderColor,
  borderWidth: 1.6,
  borderStyle: 'solid',
  borderRadius: theme.designSystem.size.borderRadius.m,
  ...customFocusOutline({ theme, isFocus }),
  textAlign: 'left',
  alignItems: 'center',
  ...(Platform.OS === 'web' && { padding: theme.designSystem.size.spacing.s }),
}))

const StyledText = styled(Typo.BodyAccentXs).attrs({
  ellipsizeMode: 'tail',
  numberOfLines: 3,
})<{ isHover?: boolean }>(({ theme, isHover }) => ({
  marginHorizontal: Number(theme.designSystem.size.spacing.s),
  ...getHoverStyle({ underlineColor: theme.designSystem.color.text.default, isHover }),
}))
