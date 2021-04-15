import { ViewStyle } from 'react-native'

export type AndroidShadow = Pick<ViewStyle, 'elevation'>

export type ShadowInput = {
  shadowOffset: {
    width: number
    height: number
  }
  shadowRadius: number
  shadowColor: ColorsEnum
  shadowOpacity: number
}

export type AnimatedShadowInput = {
  shadowOffset: {
    width: number | Animated.AnimatedInterpolation | Animated.Value
    height: number | Animated.AnimatedInterpolation | Animated.Value
  }
  shadowRadius: number | Animated.AnimatedInterpolation | Animated.Value
  shadowColor: ColorsEnum | Animated.AnimatedInterpolation | Animated.Value
  shadowOpacity: number | Animated.AnimatedInterpolation | Animated.Value
}

export type iOSShadowOutput = {
  shadowOffset: string
  shadowRadius: number
  shadowColor: ColorsEnum
  shadowOpacity: string
}

export function getShadow(shadowInput: ShadowInput): iOSShadowOutput | AndroidShadow

export function getNativeShadow(shadowInput: ShadowInput): ShadowInput | AndroidShadow
export function getAnimatedNativeShadow(
  shadowInput: AnimatedShadowInput
): ShadowInput | AndroidShadow
