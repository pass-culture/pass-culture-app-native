import React, { FunctionComponent, useMemo } from 'react'
import BaseFastImage, { FastImageProps } from 'react-native-fast-image'

import { useResizeImageURL } from 'libs/resizing-image-on-demand/useResizeImageURL'

type Props = Omit<FastImageProps, 'source'> & {
  uri: string
  children?: never
}

export const FastImage: FunctionComponent<Props> = ({ uri, ...imageProps }) => {
  const resizingImageURI = useResizeImageURL(uri)

  const source = useMemo(() => ({ uri: resizingImageURI }), [resizingImageURI])

  return <BaseFastImage source={source} {...imageProps} />
}
