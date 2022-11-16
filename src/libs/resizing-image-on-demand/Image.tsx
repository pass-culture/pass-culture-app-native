import React, { FunctionComponent, useMemo } from 'react'
import { Image as RNImage, ImageProps } from 'react-native'

import { useResizeImageURL } from 'libs/resizing-image-on-demand/useResizeImageURL'

type Props = Omit<ImageProps, 'source'> & {
  url: string
  height?: number
  width?: number
  children?: never
}

export const Image: FunctionComponent<Props> = ({ url, height, width, ...imageProps }) => {
  const resizingImageURL = useResizeImageURL({ imageURL: url, height, width })

  const source = useMemo(() => ({ uri: resizingImageURL }), [resizingImageURL])

  return <RNImage source={source} {...imageProps} />
}
