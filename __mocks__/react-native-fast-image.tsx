import React, { useEffect } from 'react'
// eslint-disable-next-line no-restricted-imports
import FImage, { FastImageProps, OnLoadEvent } from 'react-native-fast-image'

function FastImage(props: FastImageProps) {
  useEffect(() => {
    props.onLoad?.({} as OnLoadEvent)
  }, [props])

  return <FImage {...props} />
}

export default FastImage
