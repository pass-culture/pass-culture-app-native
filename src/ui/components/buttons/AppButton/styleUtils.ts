import { DefaultTheme } from 'styled-components/native'

import { TouchableOpacityButtonProps } from 'ui/components/buttons/AppButton/types'
import { getEffectiveBorderRadius } from 'ui/components/buttons/AppButton/utils'
import { padding } from 'ui/theme'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'
import { getHoverStyle } from 'ui/theme/getHoverStyle/getHoverStyle'

type ButtonStylesArgs = {
  theme: DefaultTheme
  activeOpacity?: number
} & TouchableOpacityButtonProps

export const appButtonStyles = ({
  theme,
  inline,
  buttonHeight,
  inlineHeight,
  mediumWidth,
  fullWidth,
  justifyContent,
  numberOfLines = 1,
  center,
  backgroundColor,
}: ButtonStylesArgs) => {
  const heightButton = () => {
    if (buttonHeight === 'extraSmall') return theme.buttons.buttonHeights.extraSmall
    if (buttonHeight === 'tall') return theme.buttons.buttonHeights.tall
    return theme.buttons.buttonHeights.small
  }

  const defaultPadding = 2

  const hasBackground = backgroundColor !== undefined
  const borderRadius = theme.designSystem.size.borderRadius.xl
  const effectiveBorderRadius = getEffectiveBorderRadius({
    borderRadius,
    buttonHeight: heightButton(),
  })
  const horizontalPadding = hasBackground ? effectiveBorderRadius : defaultPadding

  return {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: justifyContent ?? 'center',
    borderRadius,
    padding: defaultPadding,
    paddingLeft: horizontalPadding,
    paddingRight: horizontalPadding,
    minHeight: heightButton(),
    width: '100%',
    backgroundColor,
    ...(center ? { alignSelf: 'center' } : {}),
    ...(fullWidth ? {} : { maxWidth: theme.contentPage.maxWidth }),
    ...(mediumWidth ? { maxWidth: theme.contentPage.mediumWidth } : {}),
    ...(inline
      ? {
          borderWidth: 0,
          borderRadius: 0,
          marginTop: 0,
          ...padding(0),
          width: 'auto',
          minHeight: inlineHeight ?? theme.buttons.buttonHeights.inline,
        }
      : {}),
    ...(justifyContent === 'flex-start' ? { paddingRight: 0, paddingLeft: 0 } : {}),
    ...(numberOfLines > 1 ? { height: 'auto' } : {}),
  } as const
}

export const appButtonWebStyles = ({
  theme,
  focusOutlineColor,
  hoverUnderlineColor,
  ...rest
}: ButtonStylesArgs) => {
  return {
    ...(appButtonStyles({ theme, ...rest }) as Record<string, unknown>),
    cursor: 'pointer',
    outline: 'none',
    borderWidth: 0,
    display: 'flex',
    overflow: 'hidden',
    textDecoration: 'none',
    boxSizing: 'border-box',
    ['&:disabled']: {
      cursor: 'initial',
      background: 'none',
    },
    ...customFocusOutline({ color: focusOutlineColor }),
    ...getHoverStyle({
      underlineColor: hoverUnderlineColor ?? theme.designSystem.color.text.default,
    }),
  } as const
}

export const appTouchableOpacityWebStyles = ({
  theme,
  hoverUnderlineColor,
  activeOpacity,
}: ButtonStylesArgs) => {
  const underlineColor =
    hoverUnderlineColor === undefined ? theme.designSystem.color.text.default : hoverUnderlineColor
  return {
    flexDirection: 'column',
    cursor: 'pointer',
    borderWidth: 0,
    display: 'flex',
    backgroundColor: 'transparent',
    padding: 0,
    ['&:active']: {
      opacity: activeOpacity ?? theme.activeOpacity,
      outline: 'none',
    },
    ['&:focus']: {
      outline: 'auto',
    },
    ['&:disabled']: {
      cursor: 'initial',
    },
    ...getHoverStyle({ underlineColor: underlineColor ?? theme.designSystem.color.text.default }),
  } as const
}
