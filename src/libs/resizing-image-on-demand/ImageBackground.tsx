import React, { FunctionComponent, useMemo } from 'react'
import { ImageBackground as RNImageBackground, ImageBackgroundProps } from 'react-native'

import { useResizeImageURL } from 'libs/resizing-image-on-demand/useResizeImageURL'

type Props = Omit<ImageBackgroundProps, 'source'> & {
  url: string
}

export const ImageBackground: FunctionComponent<Props> = ({ url, children, ...imageProps }) => {
  const resizingImageURL = useResizeImageURL(url)

  const source = useMemo(() => ({ uri: resizingImageURL }), [resizingImageURL])

  return (
    <RNImageBackground source={source} {...imageProps}>
      {children}
    </RNImageBackground>
  )
}
