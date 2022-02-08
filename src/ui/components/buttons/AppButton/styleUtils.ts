import { RefAttributes } from 'react'
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

type ButtonStylesArgs = {
  theme: DefaultTheme
} & TouchableOpacityButtonProps

export const buttonStyles: ButtonStyles = ({
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
  height:
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
        height: inlineHeight ?? theme.buttons.buttonHeights.inline,
      }
    : {}),
  ...(justifyContent === 'flex-start' ? { paddingRight: 0, paddingLeft: 0 } : {}),
  ...(numberOfLines ? { height: 'auto' } : {}),
})

export const buttonWebStyles = ({ theme, ...rest }: ButtonStylesArgs) => {
  const webStyles = {
    cursor: 'pointer',
    outline: 'none',
    borderStyle: 'solid',
    boxShadow: 'none',
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
  }
  const nativeStyles = buttonStyles({ theme, ...rest })
  return {
    ...(nativeStyles as Record<string, unknown>),
    ...webStyles,
  }
}
