import React, { FC, ReactNode } from 'react'
import styled from 'styled-components/native'

import { CategoryIdEnum } from 'api/gen'
import { ImageTile } from 'ui/components/ImageTile'
import { NewOfferCaption } from 'ui/components/NewOfferCaption'
import { Tag } from 'ui/components/Tag/Tag'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { getSpacing } from 'ui/theme'

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
  interactionTag?: ReactNode
}

export const PlaylistCardOffer: FC<Props> = ({
  thumbnailUrl,
  categoryId,
  name,
  categoryLabel,
  date,
  price,
  width,
  height,
  distance,
  interactionTag,
}) => {
  return (
    <Container maxWidth={width}>
      <ImageTile categoryId={categoryId} uri={thumbnailUrl} width={width} height={height} />
      {interactionTag ?? null}
      <NewOfferCaption name={name} date={date} price={price} categoryLabel={categoryLabel} />
      {distance ? <DistanceTag label={`à ${distance}`} /> : null}
    </Container>
  )
}

const Container = styled(ViewGap).attrs({
  gap: 2,
})<{ maxWidth: number }>(({ maxWidth }) => ({
  maxWidth,
}))

const DistanceTag = styled(Tag).attrs(() => ({
  testID: 'DistanceId',
}))(({ theme }) => ({
  position: 'absolute',
  top: getSpacing(2),
  left: getSpacing(2),
  zIndex: 1,
  backgroundColor: theme.colors.white,
}))
