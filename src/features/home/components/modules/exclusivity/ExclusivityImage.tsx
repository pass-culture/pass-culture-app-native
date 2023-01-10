import React from 'react'
import { PixelRatio } from 'react-native'
import styled from 'styled-components/native'

import { FastImage } from 'libs/resizing-image-on-demand/FastImage'
import { LENGTH_XL, MARGIN_DP, RATIO_EXCLU } from 'ui/theme'

export const ExclusivityImage = ({ alt, imageURL }: { alt: string; imageURL: string }) => {
  return <Image url={imageURL} accessibilityLabel={alt} />
}

const Image = styled(FastImage)(({ theme }) => ({
  backgroundColor: theme.colors.primary,
  borderRadius: theme.borderRadius.radius,
  maxHeight: LENGTH_XL,
  height: PixelRatio.roundToNearestPixel((theme.appContentWidth - 2 * MARGIN_DP) * RATIO_EXCLU),
}))
