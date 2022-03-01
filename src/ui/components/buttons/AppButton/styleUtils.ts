import { ButtonHTMLAttributes, DetailedHTMLProps, RefAttributes } from 'react'
import { TouchableOpacity, TouchableOpacityProps } from 'react-native'
import { InterpolationFunction, ThemedStyledProps } from 'styled-components'
import { DefaultTheme } from 'styled-components/native'

import { TouchableOpacityButtonProps } from 'ui/components/buttons/AppButton/types'

type ButtonStyles = InterpolationFunction<
  ThemedStyledProps<
    TouchableOpacityProps & RefAttributes<TouchableOpacity> & TouchableOpacityButtonProps,
    DefaultTheme
  >
>

export type ButtonStylesWeb = InterpolationFunction<
  ThemedStyledProps<
    DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> &
      TouchableOpacityButtonProps,
    DefaultTheme
  >
>

type ButtonStylesArgs = {
  theme: DefaultTheme
} & TouchableOpacityButtonProps

export const appButtonStyles: ButtonStyles = ({
  theme,
  inline,
  buttonHeight,
  inlineHeight,
  mediumWidth,
  fullWidth,
  justifyContent,
  numberOfLines,
  center,
}: ButtonStylesArgs) => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: justifyContent ?? 'center',
  borderRadius: theme.borderRadius.button,
  padding: 2,
  minHeight:
    buttonHeight === 'tall' ? theme.buttons.buttonHeights.tall : theme.buttons.buttonHeights.small,
  width: '100%',
  ...(center ? { alignSelf: 'center' } : {}),
  ...(fullWidth ? {} : { maxWidth: theme.contentPage.maxWidth }),
  ...(mediumWidth ? { maxWidth: theme.contentPage.mediumWidth } : {}),
  ...(inline
    ? {
        borderWidth: 0,
        borderRadius: 0,
        marginTop: 0,
        padding: 0,
        width: 'auto',
        minHeight: inlineHeight ?? theme.buttons.buttonHeights.inline,
      }
    : {}),
  ...(justifyContent === 'flex-start' ? { paddingRight: 0, paddingLeft: 0 } : {}),
  ...(numberOfLines ? { height: 'auto' } : {}),
})

export const appButtonWebStyles: ButtonStylesWeb = ({ theme, ...rest }: ButtonStylesArgs) => {
  return {
    ...(appButtonStyles({ theme, ...rest }) as Record<string, unknown>),
    cursor: 'pointer',
    outline: 'none',
    borderStyle: 'solid',
    borderWidth: 0,
    display: 'flex',
    overflow: 'hidden',
    ['&:focus']: {
      outline: 'auto',
    },
    ['&:active']: {
      opacity: theme.activeOpacity,
      outline: 'none',
    },
    ['&:disabled']: {
      cursor: 'initial',
      background: 'none',
    },
  }
}

export const appTouchableOpacityWebStyles: ButtonStylesWeb = ({ theme }: ButtonStylesArgs) => {
  return {
    flexDirection: 'column',
    cursor: 'pointer',
    borderWidth: 0,
    display: 'flex',
    backgroundColor: 'transparent',
    padding: 0,
    ['&:active']: {
      opacity: theme.activeOpacity,
      outline: 'none',
    },
    ['&:focus']: {
      outline: 'auto',
    },
  }
}
