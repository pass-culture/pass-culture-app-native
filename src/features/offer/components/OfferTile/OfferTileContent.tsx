import React, { FC } from 'react'
import { PixelRatio, View } from 'react-native'
import styled from 'styled-components/native'

import { CategoryIdEnum } from 'api/gen'
import { ImageCaption } from 'ui/components/ImageCaption'
import { ImageTile } from 'ui/components/ImageTile'
import { OfferCaption } from 'ui/components/OfferCaption'
import { MARGIN_DP } from 'ui/theme'

type Props = {
  name?: string
  date?: string
  isDuo?: boolean
  isBeneficiary?: boolean
  price: string
  width: number
  height: number
  categoryLabel: string | null
  distance?: string
  thumbnailUrl?: string
  categoryId?: CategoryIdEnum | null
}
export const OfferTileContent: FC<Props> = ({
  name,
  date,
  isDuo,
  isBeneficiary,
  price,
  width,
  height,
  categoryLabel,
  distance,
  thumbnailUrl,
  categoryId,
}) => {
  return (
    <Container>
      <OfferCaption
        imageWidth={width}
        name={name}
        date={date}
        isDuo={isDuo}
        isBeneficiary={isBeneficiary}
        price={price}
      />
      <View>
        <ImageTile
          width={width}
          height={height - IMAGE_CAPTION_HEIGHT}
          uri={thumbnailUrl}
          onlyTopBorderRadius
          categoryId={categoryId}
        />
        <ImageCaption
          height={IMAGE_CAPTION_HEIGHT}
          width={width}
          categoryLabel={categoryLabel}
          distance={distance}
        />
      </View>
    </Container>
  )
}

const IMAGE_CAPTION_HEIGHT = PixelRatio.roundToNearestPixel(MARGIN_DP)
const Container = styled.View({ flexDirection: 'column-reverse' })
