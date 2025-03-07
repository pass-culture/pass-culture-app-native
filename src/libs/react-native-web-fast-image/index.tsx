import React, { FC } from 'react'
import { StyleSheet, View } from 'react-native'
import { FastImageProps } from 'react-native-fast-image'
import styled from 'styled-components'

const FastImage: FC<FastImageProps & { forwardedRef?: React.LegacyRef<View> }> = ({
  source,
  style,
  accessibilityLabel,
  children,
  forwardedRef,
}) => {
  return (
    <View style={[styles.imageContainer, style]} ref={forwardedRef}>
      <StyledImg
        src={typeof source === 'number' ? undefined : source?.uri}
        loading="lazy"
        alt={accessibilityLabel || ''}
      />
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

const styles = StyleSheet.create({
  imageContainer: {
    overflow: 'hidden',
  },
})

export default FastImage
