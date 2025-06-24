import React from 'react'
import { Platform, useWindowDimensions } from 'react-native'
import styled from 'styled-components/native'

import { getSearchNavConfig } from 'features/navigation/SearchStackNavigator/getSearchNavConfig'
import { NativeCategoryEnum, SearchState } from 'features/search/types'
import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { useHandleHover } from 'libs/hooks/useHandleHover'
import { ColorsType } from 'theme/types'
import { styledButton } from 'ui/components/buttons/styledButton'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { getShadow, Typo } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import type { ColorsEnum } from 'ui/theme/colors'
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
      navigateTo={getSearchNavConfig('SearchResults', searchParams)}
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
  backgroundColor: ColorsEnum
  borderColor: ColorsEnum
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
  borderRadius: theme.borderRadius.radius,
  ...getShadow({
    shadowOffset: { width: 0, height: getSpacing(1) },
    shadowRadius: getSpacing(1),
    shadowColor: theme.colors.greyDark,
    shadowOpacity: 0.2,
  }),
  ...customFocusOutline({ isFocus }),
  textAlign: 'left',
  alignItems: 'center',
  padding: getSpacing(2),
}))

const StyledText = styledButton(Typo.BodyAccentXs).attrs({
  ellipsizeMode: 'tail',
  numberOfLines: 2,
  ...(Platform.OS === 'ios' && { paddingRight: getSpacing(4) }),
})<{ isHover?: boolean }>(({ theme, isHover }) => ({
  ...getHoverStyle(theme.designSystem.color.text.default, isHover),
}))
