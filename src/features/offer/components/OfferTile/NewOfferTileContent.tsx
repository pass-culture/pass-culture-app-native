import React, { FC } from 'react'
import styled from 'styled-components/native'

import { CategoryIdEnum } from 'api/gen'
import { ImageTile } from 'ui/components/ImageTile'
import { NewOfferCaption } from 'ui/components/NewOfferCaption'
import { getSpacing, Typo } from 'ui/theme'

type Props = {
  categoryId?: CategoryIdEnum | null
  thumbnailUrl?: string
  name?: string
  date?: string
  price: string
  categoryLabel: string | null
  width: number
  height: number
  distance?: string
  isDuo?: boolean
  isBeneficiary?: boolean
}

export const NewOfferTileContent: FC<Props> = ({
  thumbnailUrl,
  categoryId,
  name,
  categoryLabel,
  date,
  price,
  width,
  height,
  distance,
  isBeneficiary,
  isDuo,
}) => {
  const distanceText = `à ${distance}`

  return (
    <Container maxWidth={width}>
      <NewOfferCaption
        name={name}
        date={date}
        price={price}
        categoryLabel={categoryLabel}
        isDuo={isDuo}
        isBeneficiary={isBeneficiary}
      />
      <ImageContainer>
        {distance ? (
          <Distance>
            <Typo.Hint>{distanceText}</Typo.Hint>
          </Distance>
        ) : null}
        <ImageTile categoryId={categoryId} uri={thumbnailUrl} width={width} height={height} />
      </ImageContainer>
    </Container>
  )
}

const Container = styled.View<{ maxWidth: number }>(({ maxWidth }) => ({
  flexDirection: 'column-reverse',
  gap: getSpacing(2),
  maxWidth,
}))

const ImageContainer = styled.View({})

const Distance = styled.View.attrs(() => ({
  testID: 'DistanceId',
}))(({ theme }) => ({
  paddingVertical: getSpacing(1),
  paddingHorizontal: getSpacing(2),
  position: 'absolute',
  top: getSpacing(2),
  left: getSpacing(2),
  borderRadius: getSpacing(1),
  zIndex: 1,
  backgroundColor: theme.colors.white,
}))
