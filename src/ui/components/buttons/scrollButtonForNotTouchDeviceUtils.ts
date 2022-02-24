import { t } from '@lingui/macro'
import { ButtonHTMLAttributes, DetailedHTMLProps, RefAttributes } from 'react'
import { TouchableOpacity, TouchableOpacityProps } from 'react-native'
import { InterpolationFunction, ThemedStyledProps } from 'styled-components'
import { DefaultTheme } from 'styled-components/native'

import { getSpacing } from 'ui/theme'

type HorizontalAlignPropStyle = {
  horizontalAlign: 'left' | 'right'
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
    TouchableOpacityProps & RefAttributes<TouchableOpacity> & ScrollButtonPropStyle,
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

export const scrollButtonAriaDescribedBy = ({ horizontalAlign }: HorizontalAlignPropStyle) => {
  return horizontalAlign === 'left'
    ? t`voir les propositions précédentes`
    : t`voir les propositions suivantes`
}

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

export const scrollButtonWebStyles: ScrollButtonForNotTouchDevicePropsStylesWeb = ({
  theme,
  ...rest
}: ScrollButtonPropStyle) => ({
  ...(scrollButtonStyles({ theme, ...rest }) as Record<string, unknown>),
  cursor: 'pointer',
  outline: 'none',
  borderStyle: 'solid',
  borderWidth: 0,
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
