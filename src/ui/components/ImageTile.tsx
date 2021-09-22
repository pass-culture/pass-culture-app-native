import React, { useMemo } from 'react'
import FastImage from 'react-native-fast-image'

import { BorderRadiusEnum } from 'ui/theme/grid'

interface Props {
  imageWidth: number
  imageHeight: number
  uri?: string
  onlyTopBorderRadius?: boolean | false
}

export const ImageTile: React.FC<Props> = (props) => {
  const style = useMemo(
    () => ({
      height: props.imageHeight,
      width: props.imageWidth,
      ...(props.onlyTopBorderRadius
        ? {
            borderTopLeftRadius: BorderRadiusEnum.BORDER_RADIUS,
            borderTopRightRadius: BorderRadiusEnum.BORDER_RADIUS,
          }
        : { borderRadius: BorderRadiusEnum.BORDER_RADIUS }),
    }),
    [props.imageHeight, props.imageWidth, props.onlyTopBorderRadius]
  )

  const source = useMemo(() => ({ uri: props.uri }), [props.uri])

  return props.uri ? <FastImage style={style} source={source} testID="tileImage" /> : null
}
