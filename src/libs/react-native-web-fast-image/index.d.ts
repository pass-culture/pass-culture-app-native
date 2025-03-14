import React from 'react'
import {
  FlexStyle,
  LayoutChangeEvent,
  // eslint-disable-next-line react-native/split-platform-components
  ShadowStyleIOS,
  StyleProp,
  TransformsStyle,
} from 'react-native'

declare namespace FastImage {
  namespace priority {
    type low = 'low'
    type normal = 'normal'
    type high = 'high'
  }

  namespace resizeMode {
    type contain = 'contain'
    type cover = 'cover'
    type stretch = 'stretch'
    type center = 'center'
  }

  namespace cacheControl {
    type cacheOnly = 'cacheOnly'
    type immutable = 'immutable'
    type web = 'web'
  }

  export type Priority =
    | FastImage.priority.low
    | FastImage.priority.normal
    | FastImage.priority.high

  export type ResizeMode =
    | FastImage.resizeMode.contain
    | FastImage.resizeMode.cover
    | FastImage.resizeMode.stretch
    | FastImage.resizeMode.center

  export type Cache =
    | FastImage.cacheControl.cacheOnly
    | FastImage.cacheControl.immutable
    | FastImage.cacheControl.web
}

type FastImageSource = {
  uri?: string
  headers?: { [key: string]: string }
  priority?: FastImage.Priority
  cache?: FastImage.Cache
}

interface ImageStyle extends FlexStyle, TransformsStyle, ShadowStyleIOS {
  backfaceVisibility?: 'visible' | 'hidden'
  borderBottomLeftRadius?: number
  borderBottomRightRadius?: number
  backgroundColor?: string
  borderColor?: string
  borderWidth?: number
  borderRadius?: number
  borderTopLeftRadius?: number
  borderTopRightRadius?: number
  overlayColor?: string
  tintColor?: string
  opacity?: number
}

interface OnLoadEvent {
  nativeEvent: {
    width: number
    height: number
  }
}

interface OnProgressEvent {
  nativeEvent: {
    loaded: number
    total: number
  }
}

interface FastImageProperties {
  source: FastImageSource | number
  resizeMode?: FastImage.ResizeMode
  fallback?: boolean

  onLoadStart?(): void

  onProgress?(event: OnProgressEvent): void

  onLoad?(event: OnLoadEvent): void

  onError?(): void

  onLoadEnd?(): void

  /**
   * onLayout function
   *
   * Invoked on mount and layout changes with
   *
   * {nativeEvent: { layout: {x, y, width, height}}}.
   */
  onLayout?: (event: LayoutChangeEvent) => void

  /**
   *
   * Style
   */
  style?: StyleProp<ImageStyle>

  /**
   * TintColor
   *
   * If supplied, changes the color of all the non-transparent pixels to the given color.
   */

  tintColor?: number | string

  /**
   * A unique identifier for this element to be used in UI Automation testing scripts.
   */
  testID?: string
}

interface FastImageStatic extends React.ComponentClass<FastImageProperties> {
  resizeMode: {
    contain: FastImage.resizeMode.contain
    cover: FastImage.resizeMode.cover
    stretch: FastImage.resizeMode.stretch
    center: FastImage.resizeMode.center
  }

  priority: {
    low: FastImage.priority.low
    normal: FastImage.priority.normal
    high: FastImage.priority.high
  }

  cacheControl: {
    cacheOnly: FastImage.cacheControl.cacheOnly
    immutable: FastImage.cacheControl.immutable
    web: FastImage.cacheControl.web
  }

  preload(sources: FastImageSource[]): void
}

declare const FastImage: FastImageStatic

type FastImage = FastImageStatic

export default FastImage
