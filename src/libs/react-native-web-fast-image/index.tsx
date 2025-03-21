// @ts-ignore Fix later
import { ViewPropTypes } from 'deprecated-react-native-prop-types'
import PropTypes from 'prop-types'
import React, { forwardRef, memo } from 'react'
import { View, NativeModules, StyleSheet } from 'react-native'
import styled from 'styled-components'

const FastImageViewNativeModule = NativeModules.FastImageView
// @ts-ignore Fix later
function FastImageBase({ source, style, accessibilityLabel, children, forwardedRef, ...props }) {
  return (
    <View style={[styles.imageContainer, style]} ref={forwardedRef}>
      <StyledImg src={source.uri} loading="lazy" alt={accessibilityLabel || ''} {...props} />
      {children}
    </View>
  )
}

const StyledImg = styled.img({
  objectFit: 'cover',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
})

const FastImageMemo = memo(FastImageBase)
// @ts-ignore Fix later
const FastImage = forwardRef((props, ref) => <FastImageMemo forwardedRef={ref} {...props} />)

FastImage.displayName = 'FastImage'

const styles = StyleSheet.create({
  imageContainer: {
    overflow: 'hidden',
  },
})
// @ts-ignore Fix later
FastImage.resizeMode = {
  contain: 'contain',
  cover: 'cover',
  stretch: 'stretch',
  center: 'center',
}
// @ts-ignore Fix later

FastImage.priority = {
  // lower than usual.
  low: 'low',
  // normal, the default.
  normal: 'normal',
  // higher than usual.
  high: 'high',
}
// @ts-ignore Fix later
FastImage.cacheControl = {
  // Ignore headers, use uri as cache key, fetch only if not in cache.
  immutable: 'immutable',
  // Respect http headers, no aggressive caching.
  web: 'web',
  // Only load from cache.
  cacheOnly: 'cacheOnly',
}
// @ts-ignore Fix later
FastImage.preload = (sources) => {
  FastImageViewNativeModule.preload(sources)
}

FastImage.defaultProps = {
  // @ts-ignore Fix later
  resizeMode: FastImage.resizeMode.cover,
}

const FastImageSourcePropType = PropTypes.shape({
  uri: PropTypes.string,
  headers: PropTypes.objectOf(PropTypes.string),
  // @ts-ignore Fix later
  priority: PropTypes.oneOf(Object.keys(FastImage.priority)),
  // @ts-ignore Fix later
  cache: PropTypes.oneOf(Object.keys(FastImage.cacheControl)),
})

FastImage.propTypes = {
  ...ViewPropTypes,
  source: PropTypes.oneOfType([FastImageSourcePropType, PropTypes.number]),
  tintColor: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onLoadStart: PropTypes.func,
  onProgress: PropTypes.func,
  onLoad: PropTypes.func,
  onError: PropTypes.func,
  onLoadEnd: PropTypes.func,
  fallback: PropTypes.bool,
  // @ts-ignore Fix later
  resizeMode: PropTypes.oneOf(Object.keys(FastImage.resizeMode)),
}

FastImageBase.propTypes = {
  ...ViewPropTypes,
}

export default FastImage
