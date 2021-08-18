import React from 'react'
import { Image as ImageDefault, ImageProps as ImagePropsDefault } from 'react-native-svg'

export const Image = function Image({ href, ...rest }: ImagePropsDefault) {
  // @ts-expect-error on the web, react-native-svg Image expect the href to be a string, not an object with { uri }
  return <ImageDefault href={href?.uri} {...rest} />
}
