/**
 * Code adapted from https://github.com/DylanVann/react-native-fast-image/pull/966/files
 * This implementation provides web support for react-native-fast-image
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { forwardRef, memo } from 'react'
import {
  View,
  NativeModules,
  StyleSheet,
  FlexStyle,
  LayoutChangeEvent,
  // eslint-disable-next-line no-restricted-imports
  Image,
  StyleProp,
  TransformsStyle,
  ImageRequireSource,
  AccessibilityProps,
  ViewProps,
  ColorValue,
} from 'react-native'

export type ResizeMode = 'contain' | 'cover' | 'stretch' | 'center'

const resizeMode = {
  contain: 'contain',
  cover: 'cover',
  stretch: 'stretch',
  center: 'center',
} as const

export type Priority = 'low' | 'normal' | 'high'

const priority = {
  low: 'low',
  normal: 'normal',
  high: 'high',
} as const

type Cache = 'immutable' | 'web' | 'cacheOnly'

const cacheControl = {
  // Ignore headers, use uri as cache key, fetch only if not in cache.
  immutable: 'immutable',
  // Respect http headers, no aggressive caching.
  web: 'web',
  // Only load from cache.
  cacheOnly: 'cacheOnly',
} as const

export type Source = {
  uri?: string
  headers?: { [key: string]: string }
  priority?: Priority
  cache?: Cache
}

export interface OnLoadEvent {
  nativeEvent: {
    width: number
    height: number
  }
}

export interface OnProgressEvent {
  nativeEvent: {
    loaded: number
    total: number
  }
}

export interface ImageStyle extends FlexStyle, TransformsStyle {
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
  opacity?: number
}

export interface FastImageProps extends AccessibilityProps, ViewProps {
  source?: Source | ImageRequireSource
  defaultSource?: ImageRequireSource
  resizeMode?: ResizeMode
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

  tintColor?: ColorValue

  /**
   * A unique identifier for this element to be used in UI Automation testing scripts.
   */
  testID?: string

  /**
   * Render children within the image.
   */
  children?: React.ReactNode
}

function FastImageBase({
  source,
  tintColor,
  onLoadStart,
  onProgress,
  onLoad,
  onError,
  onLoadEnd,
  style,
  children,
  resizeMode = 'cover',
  forwardedRef,
  ...props
}: FastImageProps & { forwardedRef: React.Ref<any> }) {
  const cleanedSource = { ...(source as any) }
  delete cleanedSource.cache

  return (
    <View style={[styles.imageContainer, style]} ref={forwardedRef}>
      <Image
        {...props}
        style={[StyleSheet.absoluteFill, { tintColor }]}
        source={cleanedSource}
        defaultSource={cleanedSource}
        onLoadStart={onLoadStart}
        onProgress={onProgress}
        onLoad={onLoad as any}
        onError={onError}
        onLoadEnd={onLoadEnd}
        resizeMode={resizeMode}
      />
      {children}
    </View>
  )
}

const FastImageMemo = memo(FastImageBase)

const FastImageComponent: React.ComponentType<FastImageProps> = forwardRef(
  (props: FastImageProps, ref: React.Ref<any>) => <FastImageMemo forwardedRef={ref} {...props} />
)

FastImageComponent.displayName = 'FastImage'

export interface FastImageStaticProperties {
  resizeMode: typeof resizeMode
  priority: typeof priority
  cacheControl: typeof cacheControl
  preload: (sources: Source[]) => void
  clearMemoryCache: () => Promise<void>
  clearDiskCache: () => Promise<void>
}

const FastImage: React.ComponentType<FastImageProps> & FastImageStaticProperties =
  FastImageComponent as any

FastImage.resizeMode = resizeMode

FastImage.cacheControl = cacheControl

FastImage.priority = priority

FastImage.preload = (sources: Source[]) => NativeModules.FastImageView.preload(sources)

FastImage.clearMemoryCache = () => NativeModules.FastImageView.clearMemoryCache()

FastImage.clearDiskCache = () => NativeModules.FastImageView.clearDiskCache()

const styles = StyleSheet.create({
  imageContainer: {
    overflow: 'hidden',
  },
})

export default FastImage
