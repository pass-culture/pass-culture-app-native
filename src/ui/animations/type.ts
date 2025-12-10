/* eslint-disable @typescript-eslint/no-explicit-any */
export interface AnimationObject {
  v: string
  fr: number
  ip: number
  op: number
  w: number
  h: number
  nm?: string
  ddd?: number
  assets: any[]
  layers: any[]
  markers?: any[]
}

type GradientStops = number[]

export type LottieGradient = {
  k?: {
    k?: GradientStops
  } | null
}

export type LottieColor = [number, number, number, number]

// This type was copied from lottie-react-native to make it available to the web app, as it isn't available in web implementation of lottie
