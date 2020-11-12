export type AndroidShadow =
  | {
      elevation: string
    }
  | undefined

export type iOSShadowInput = {
  shadowOffset: {
    width: number
    height: number
  }
  shadowRadius: number
  shadowColor: ColorsEnum
  shadowOpacity: number
}

export type iOSShadowOutput = {
  shadowOffset: {
    width: string
    height: string
  }
  shadowRadius: number
  shadowColor: ColorsEnum
  shadowOpacity: string
}

export function getShadow(shadowInput: iOSShadowInput): iOSShadowOutput | AndroidShadow
