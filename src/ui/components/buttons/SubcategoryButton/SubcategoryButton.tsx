import React from 'react'
import { Platform, useWindowDimensions } from 'react-native'

import { styledButton } from 'ui/components/buttons/styledButton'
import { Touchable } from 'ui/components/touchable/Touchable'
import { getShadow, Typo } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import type { ColorsEnum } from 'ui/theme/colors'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'
import { getHoverStyle } from 'ui/theme/getHoverStyle/getHoverStyle'
import { getSpacing } from 'ui/theme/spacing'

export type SubcategoryButtonProps = {
  label: string
  backgroundColor: ColorsEnum
  borderColor: ColorsEnum
  onPress: VoidFunction
  position?: number
}

export const SUBCATEGORY_BUTTON_HEIGHT = getSpacing(14)
export const SUBCATEGORY_BUTTON_WIDTH = getSpacing(45.6)

export const SubcategoryButton = ({
  label,
  backgroundColor,
  borderColor,
  onPress,
}: SubcategoryButtonProps) => {
  const windowWidth = useWindowDimensions().width

  return (
    <StyledTouchable
      onPress={onPress}
      testID={`SubcategoryButton ${label}`}
      accessibilityLabel={label}
      windowWidth={windowWidth}
      backgroundColor={backgroundColor}
      borderColor={borderColor}>
      <StyledText>{label}</StyledText>
    </StyledTouchable>
  )
}

const StyledTouchable = styledButton(Touchable)<{
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
  ...customFocusOutline({ isFocus, color: theme.colors.black }),
  textAlign: 'left',
  alignItems: 'center',
  padding: getSpacing(2),
}))

const StyledText = styledButton(Typo.Caption).attrs({
  ellipsizeMode: 'tail',
  numberOfLines: 2,
  ...(Platform.OS === 'ios' && { paddingRight: getSpacing(4) }),
})<{ isHover?: boolean }>(({ theme, isHover }) => ({
  ...getHoverStyle(theme.colors.black, isHover),
}))
