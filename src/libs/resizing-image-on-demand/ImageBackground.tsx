import React, { FunctionComponent, useMemo } from 'react'
// eslint-disable-next-line no-restricted-imports
import { ImageBackground as RNImageBackground, ImageBackgroundProps } from 'react-native'

import { useResizeImageURL } from 'libs/resizing-image-on-demand/useResizeImageURL'

type Props = Omit<ImageBackgroundProps, 'source'> & {
  url: string
  height?: number
  width?: number
}

export const ImageBackground: FunctionComponent<Props> = ({
  url,
  height,
  width,
  children,
  ...imageProps
}) => {
  const resizingImageURL = useResizeImageURL({ imageURL: url, height, width })

  const source = useMemo(() => ({ uri: resizingImageURL }), [resizingImageURL])

  return (
    <RNImageBackground source={source} {...imageProps}>
      {children}
    </RNImageBackground>
  )
}
