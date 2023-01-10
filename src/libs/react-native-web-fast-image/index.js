import PropTypes from 'prop-types'
import React, { forwardRef, memo } from 'react'
import { View, NativeModules, ViewPropTypes, StyleSheet } from 'react-native'
import styled from 'styled-components'

const FastImageViewNativeModule = NativeModules.FastImageView

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

const FastImage = forwardRef((props, ref) => <FastImageMemo forwardedRef={ref} {...props} />)

FastImage.displayName = 'FastImage'

const styles = StyleSheet.create({
  imageContainer: {
    overflow: 'hidden',
  },
})

FastImage.resizeMode = {
  contain: 'contain',
  cover: 'cover',
  stretch: 'stretch',
  center: 'center',
}

FastImage.priority = {
  // lower than usual.
  low: 'low',
  // normal, the default.
  normal: 'normal',
  // higher than usual.
  high: 'high',
}

FastImage.cacheControl = {
  // Ignore headers, use uri as cache key, fetch only if not in cache.
  immutable: 'immutable',
  // Respect http headers, no aggressive caching.
  web: 'web',
  // Only load from cache.
  cacheOnly: 'cacheOnly',
}

FastImage.preload = (sources) => {
  FastImageViewNativeModule.preload(sources)
}

FastImage.defaultProps = {
  resizeMode: FastImage.resizeMode.cover,
}

const FastImageSourcePropType = PropTypes.shape({
  uri: PropTypes.string,
  headers: PropTypes.objectOf(PropTypes.string),
  priority: PropTypes.oneOf(Object.keys(FastImage.priority)),
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
}

export default FastImage
