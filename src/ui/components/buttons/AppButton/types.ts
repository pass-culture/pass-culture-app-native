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
  accessibilityLabel?: string
  accessibilityDescribedBy?: string
  adjustsFontSizeToFit?: boolean
  buttonHeight?: 'extraSmall' | 'small' | 'tall'
  disabled?: boolean
  icon?: FunctionComponent<IconInterface>
  loadingIndicator?: ComponentType<IconInterface>
  inline?: boolean
  isLoading?: boolean
  onLongPress?: AppButtonEventWeb | AppButtonEventNative
  onPress?: AppButtonEventWeb | AppButtonEventNative
  testID?: string
  textSize?: number
  wording: string
  mediumWidth?: boolean
  fullWidth?: boolean
  justifyContent?: 'center' | 'flex-start'
  numberOfLines?: number
  center?: boolean
  type?: 'button' | 'submit' | 'reset'
  name?: string
  focusOutlineColor?: ColorsEnum
  hoverUnderlineColor?: ColorsEnum
  accessibilityRole?: AccessibilityRole
  href?: string
  target?: string
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip'
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
