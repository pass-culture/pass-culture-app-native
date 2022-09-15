import React, { FunctionComponent, useMemo } from 'react'
import BaseFastImage, { FastImageProps } from 'react-native-fast-image'

import { useResizeImageURL } from 'libs/resizing-image-on-demand/useResizeImageURL'

type Props = Omit<FastImageProps, 'source'> & {
  url: string
  children?: never
}

export const FastImage: FunctionComponent<Props> = ({ url, ...imageProps }) => {
  const resizingImageURL = useResizeImageURL(url)

  const source = useMemo(() => ({ uri: resizingImageURL }), [resizingImageURL])

  return <BaseFastImage source={source} {...imageProps} />
}
