// eslint-disable-next-line no-restricted-imports
import FImage, { FastImageProps, OnLoadEvent } from '@d11/react-native-fast-image'
import React, { useEffect } from 'react'

function FastImage(props: FastImageProps) {
  useEffect(() => {
    props.onLoad?.({} as OnLoadEvent)
  }, [props])

  return <FImage {...props} />
}

export default FastImage
