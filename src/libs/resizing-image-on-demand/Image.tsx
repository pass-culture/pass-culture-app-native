import React, { FunctionComponent, useMemo } from 'react'
import { Image as RNImage, ImageProps } from 'react-native'

import { useResizeImageURL } from 'libs/resizing-image-on-demand/useResizeImageURL'

type Props = Omit<ImageProps, 'source'> & {
  uri: string
  children?: never
}

export const Image: FunctionComponent<Props> = ({ uri, ...imageProps }) => {
  const resizingImageURI = useResizeImageURL(uri)

  const source = useMemo(() => ({ uri: resizingImageURI }), [resizingImageURI])

  return <RNImage source={source} {...imageProps} />
}
