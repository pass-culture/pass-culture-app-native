import React from 'react'
import { Platform, useWindowDimensions } from 'react-native'
import styled from 'styled-components/native'

import { getSearchPropConfig } from 'features/navigation/SearchStackNavigator/getSearchPropConfig'
import { NativeCategoryEnum, SearchState } from 'features/search/types'
import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { useHandleHover } from 'libs/hooks/useHandleHover'
import { ColorsType } from 'theme/types'
import { styledButton } from 'ui/components/buttons/styledButton'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Typo } from 'ui/theme'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'
import { getHoverStyle } from 'ui/theme/getHoverStyle/getHoverStyle'
import { getSpacing } from 'ui/theme/spacing'

export const SUBCATEGORY_BUTTON_HEIGHT = getSpacing(14)
export const SUBCATEGORY_BUTTON_WIDTH = getSpacing(45.6)

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
}

export const SubcategoryButton = ({
  label,
  backgroundColor,
  borderColor,
  searchParams,
  onBeforeNavigate,
}: SubcategoryButtonProps) => {
  const windowWidth = useWindowDimensions().width
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
      windowWidth={windowWidth}
      backgroundColor={backgroundColor}
      borderColor={borderColor}>
      <StyledText>{label}</StyledText>
    </StyledInternalTouchable>
  )
}

const StyledInternalTouchable: typeof InternalTouchableLink = styled(InternalTouchableLink)<{
  isFocus?: boolean
  windowWidth: number
  backgroundColor: ColorsType
  borderColor: ColorsType
}>(({ theme, isFocus, windowWidth, backgroundColor, borderColor }) => ({
  ...(theme.isMobileViewport
    ? {
        width: windowWidth / 2 - getSpacing(8),
      }
    : {}),
  flexDirection: 'row',
  backgroundColor,
  height: SUBCATEGORY_BUTTON_HEIGHT,
  borderColor,
  borderWidth: 1.6,
  borderStyle: 'solid',
  borderRadius: theme.designSystem.size.borderRadius.m,
  ...customFocusOutline({ isFocus }),
  textAlign: 'left',
  alignItems: 'center',
  ...(Platform.OS === 'web' && { padding: getSpacing(2) }),
}))

const StyledText = styledButton(Typo.BodyAccentXs).attrs({
  ellipsizeMode: 'tail',
  numberOfLines: 2,
})<{ isHover?: boolean }>(({ theme, isHover }) => ({
  marginHorizontal: Number(theme.designSystem.size.spacing.s),
  ...getHoverStyle({ underlineColor: theme.designSystem.color.text.default, isHover }),
}))
