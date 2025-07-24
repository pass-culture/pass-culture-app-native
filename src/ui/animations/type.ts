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

// This type was copied from lottie-react-native to make it available to the web app, as it isn't available in web implementation of lottie
