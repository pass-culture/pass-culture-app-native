import { ComponentType, CSSProperties, FunctionComponent, MouseEventHandler } from 'react'
import {
  AccessibilityRole,
  GestureResponderEvent,
  StyleProp,
  TextProps,
  ViewStyle,
} from 'react-native'

import { IconInterface } from 'ui/svg/icons/types'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

export interface TouchableOpacityButtonProps {
  buttonHeight: 'extraSmall' | 'small' | 'tall'
  inline?: boolean
  inlineHeight?: number | string
  mediumWidth?: boolean
  fullWidth?: boolean
  justifyContent?: 'center' | 'flex-start'
  numberOfLines?: number
  center?: boolean
  focusOutlineColor?: ColorsEnum
  hoverUnderlineColor?: ColorsEnum | null
  backgroundColor?: string
}

export interface AppButtonInnerProps {
  adjustsFontSizeToFit?: boolean
  icon?: FunctionComponent<IconInterface>
  iconPosition: 'left' | 'right'
  loadingIndicator?: ComponentType<IconInterface>
  isLoading?: boolean
  wording: string
  title?: ComponentType<TextProps>
  numberOfLines?: number
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip'
}

export type AppButtonEventNative = ((e: GestureResponderEvent) => void) | (() => void) | undefined
export type AppButtonEventWeb = MouseEventHandler<HTMLButtonElement> | (() => void) | undefined

export interface BaseButtonProps {
  accessibilityDescribedBy?: string
  accessibilityLabel?: string
  accessibilityRole?: AccessibilityRole
  adjustsFontSizeToFit?: boolean
  buttonHeight?: 'extraSmall' | 'small' | 'tall'
  center?: boolean
  disabled?: boolean
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip'
  focusOutlineColor?: ColorsEnum
  fullWidth?: boolean
  hoverUnderlineColor?: ColorsEnum
  href?: string
  icon?: FunctionComponent<IconInterface>
  iconPosition?: 'left' | 'right'
  inline?: boolean
  isLoading?: boolean
  justifyContent?: 'center' | 'flex-start'
  loadingIndicator?: ComponentType<IconInterface>
  mediumWidth?: boolean
  name?: string
  numberOfLines?: number
  onLongPress?: AppButtonEventWeb | AppButtonEventNative
  onPress?: AppButtonEventWeb | AppButtonEventNative
  target?: string
  testID?: string
  textSize?: number
  type?: 'button' | 'submit' | 'reset'
  wording: string
}

export interface AppButtonProps extends BaseButtonProps {
  inline?: boolean
  inlineHeight?: number | string
  title?: ComponentType<TextProps>
  style?: StyleProp<ViewStyle> | CSSProperties
  className?: string
  backgroundColor?: string
}

type Only<TestedType, StandardType> = TestedType &
  Record<Exclude<keyof TestedType, keyof StandardType>, never>

export type OnlyBaseButtonProps<TestedType> = Only<TestedType, AppButtonProps>
