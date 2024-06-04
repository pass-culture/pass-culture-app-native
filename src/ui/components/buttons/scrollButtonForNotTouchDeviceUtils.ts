import { ButtonHTMLAttributes, DetailedHTMLProps, RefAttributes } from 'react'
import { TouchableOpacityProps } from 'react-native'
import { InterpolationFunction, ThemedStyledProps } from 'styled-components'
import { DefaultTheme } from 'styled-components/native'

import { RNTouchableOpacity } from 'ui/components/TouchableOpacity'
import { getSpacing } from 'ui/theme'

type HorizontalAlignPropStyle = {
  horizontalAlign: 'left' | 'right'
  withBorder?: boolean
}

type ScrollButtonPropStyle = {
  top?: number
  theme: DefaultTheme
} & HorizontalAlignPropStyle

export type ScrollButtonForNotTouchDeviceProps = {
  children?: JSX.Element
  onPress?: () => void
} & ScrollButtonPropStyle

type ScrollButtonForNotTouchDevicePropsStylesNative = InterpolationFunction<
  ThemedStyledProps<
    TouchableOpacityProps & RefAttributes<RNTouchableOpacity> & ScrollButtonPropStyle,
    DefaultTheme
  >
>
type ScrollButtonForNotTouchDevicePropsStylesWeb = InterpolationFunction<
  ThemedStyledProps<
    DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> &
      HorizontalAlignPropStyle,
    DefaultTheme
  >
>

export const scrollButtonStyles: ScrollButtonForNotTouchDevicePropsStylesNative = ({
  theme,
  top,
  horizontalAlign,
  withBorder,
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
  borderWidth: withBorder ? 1 : theme.buttons.scrollButton.borderWidth,
  borderRadius: theme.buttons.scrollButton.size / 2,
  borderColor: theme.buttons.scrollButton.borderColor,
  backgroundColor: theme.buttons.scrollButton.backgroundColor,
  zIndex: theme.zIndex.playlistsButton,
})

export const scrollButtonWebStyles: ScrollButtonForNotTouchDevicePropsStylesWeb = ({
  theme,
  withBorder,
  ...rest
}: ScrollButtonPropStyle) => ({
  ...(scrollButtonStyles({ theme, withBorder, ...rest }) as Record<string, unknown>),
  cursor: 'pointer',
  outline: 'none',
  borderWidth: withBorder ? 1 : 0,
  display: 'flex',
  overflow: 'hidden',
  ['&:active']: {
    opacity: theme.activeOpacity,
  },
  ['&:disabled']: {
    cursor: 'initial',
    background: 'none',
  },
})
