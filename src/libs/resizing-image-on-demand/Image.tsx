import React, { FunctionComponent, useMemo } from 'react'
import { Image as RNImage, ImageProps } from 'react-native'

import { useResizeImageURL } from 'libs/resizing-image-on-demand/useResizeImageURL'

type Props = Omit<ImageProps, 'source'> & {
  url: string
  children?: never
}

export const Image: FunctionComponent<Props> = ({ url, ...imageProps }) => {
  const resizingImageURL = useResizeImageURL({ imageURL: url })

  const source = useMemo(() => ({ uri: resizingImageURL }), [resizingImageURL])

  return <RNImage source={source} {...imageProps} />
}
