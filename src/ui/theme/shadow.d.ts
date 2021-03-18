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

export type iOSShadowOutput = {
  shadowOffset: string
  shadowRadius: number
  shadowColor: ColorsEnum
  shadowOpacity: string
}

export function getShadow(shadowInput: ShadowInput): iOSShadowOutput | AndroidShadow

export function getNativeShadow(shadowInput: ShadowInput): ShadowInput | AndroidShadow
