import React, { useMemo } from 'react'
import styled from 'styled-components/native'

import { FastImage } from 'libs/resizing-image-on-demand/FastImage'
import { BorderRadiusEnum } from 'ui/theme/grid'

interface Props {
  width: number
  height: number
  uri?: string
  onlyTopBorderRadius?: boolean | false
}

export const ImageTile: React.FC<Props> = (props) => {
  const style = useMemo(
    () => ({
      height: props.height,
      width: props.width,
      ...(props.onlyTopBorderRadius
        ? {
            borderTopLeftRadius: BorderRadiusEnum.BORDER_RADIUS,
            borderTopRightRadius: BorderRadiusEnum.BORDER_RADIUS,
          }
        : { borderRadius: BorderRadiusEnum.BORDER_RADIUS }),
    }),
    [props.height, props.width, props.onlyTopBorderRadius]
  )

  return props.uri ? <StyledFastImage style={style} url={props.uri} testID="tileImage" /> : null
}

const StyledFastImage = styled(FastImage)(({ theme }) => ({
  backgroundColor: theme.colors.greyLight,
}))
