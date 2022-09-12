import React, { FunctionComponent, useMemo } from 'react'
import { ImageBackground as RNImageBackground, ImageBackgroundProps } from 'react-native'

import { useResizeImageURL } from 'libs/resizing-image-on-demand/useResizeImageURL'

type Props = Omit<ImageBackgroundProps, 'source'> & {
  uri: string
}

export const ImageBackground: FunctionComponent<Props> = ({ uri, children, ...imageProps }) => {
  const resizingImageURI = useResizeImageURL(uri)

  const source = useMemo(() => ({ uri: resizingImageURI }), [resizingImageURI])

  return (
    <RNImageBackground source={source} {...imageProps}>
      {children}
    </RNImageBackground>
  )
}
