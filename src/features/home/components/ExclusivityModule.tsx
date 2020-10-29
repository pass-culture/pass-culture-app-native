import React from 'react'
import { Image, TouchableHighlight } from 'react-native'

type Props = {
  alt: string
  image: string
  offerId: string
}

export const ExclusivityModule = (props: Props) => {
  const { alt, image, offerId } = props

  return (
    <TouchableHighlight
      onPress={() => console.log(`Opening offer ${offerId}...`)}
      style={{ width: '90%', height: 292, borderRadius: 12 }}>
      <Image
        source={{ uri: image }}
        style={{ width: 375, height: 292, borderRadius: 12 }}
        accessible={!!alt}
        accessibilityLabel={alt}
      />
    </TouchableHighlight>
  )
}
