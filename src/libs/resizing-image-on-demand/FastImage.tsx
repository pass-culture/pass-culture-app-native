import React, { FunctionComponent, useMemo } from 'react'
// eslint-disable-next-line no-restricted-imports
import BaseFastImage, { FastImageProps } from 'react-native-fast-image'

import { useResizeImageURL } from 'libs/resizing-image-on-demand/useResizeImageURL'

type Props = Omit<FastImageProps, 'source'> & {
  url: string
  height?: number
  width?: number
  accessibilityLabel?: string
  children?: never
}

export const FastImage: FunctionComponent<Props> = ({ url, height, width, ...imageProps }) => {
  const resizingImageURL = useResizeImageURL({ imageURL: url, height, width })

  const source = useMemo(() => ({ uri: resizingImageURL }), [resizingImageURL])

  return <BaseFastImage source={source} {...imageProps} />
}
