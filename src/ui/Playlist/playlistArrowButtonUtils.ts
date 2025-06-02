import { RefAttributes } from 'react'
import { TouchableOpacityProps } from 'react-native'
import { InterpolationFunction, ThemedStyledProps } from 'styled-components'
import { DefaultTheme } from 'styled-components/native'

import { RNTouchableOpacity } from 'ui/components/TouchableOpacity'
import { getSpacing } from 'ui/theme'

type HorizontalAlignPropStyle = {
  horizontalAlign: 'left' | 'right'
}

type ScrollButtonPropStyle = {
  top?: number
  theme: DefaultTheme
} & HorizontalAlignPropStyle

export type ScrollButtonForNotTouchDeviceProps = {
  children?: React.JSX.Element
  onPress?: () => void
} & ScrollButtonPropStyle

type ScrollButtonForNotTouchDevicePropsStylesNative = InterpolationFunction<
  ThemedStyledProps<
    TouchableOpacityProps & RefAttributes<typeof RNTouchableOpacity> & ScrollButtonPropStyle,
    DefaultTheme
  >
>

export const scrollButtonStyles: ScrollButtonForNotTouchDevicePropsStylesNative = ({
  theme,
  top,
  horizontalAlign,
}: ScrollButtonPropStyle) => ({
  position: 'absolute',
  justifyContent: 'center',
  alignItems: 'center',
  margin: 'auto',
  height: theme.buttons.scrollButton.size,
  width: theme.buttons.scrollButton.size,
  right: horizontalAlign === 'right' ? getSpacing(2) : 'auto',
  left: horizontalAlign === 'left' ? getSpacing(2) : 'auto',
  top: top ? top - theme.buttons.scrollButton.size / 2 : 0,
  bottom: top ? 'auto' : 0,
  borderWidth: theme.buttons.scrollButton.borderWidth,
  borderRadius: theme.buttons.scrollButton.size / 2,
  borderColor: theme.buttons.scrollButton.borderColor,
  backgroundColor: theme.buttons.scrollButton.backgroundColor,
  zIndex: theme.zIndex.playlistsButton,
})
