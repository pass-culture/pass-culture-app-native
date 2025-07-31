import React, { FC, ReactNode } from 'react'
import styled from 'styled-components/native'

import { CategoryIdEnum } from 'api/gen'
import { ImageTile } from 'ui/components/ImageTile'
import { OfferCaption } from 'ui/components/OfferCaption'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'

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
    <Container maxWidth={width} testID="playlistCardOffer">
      <ImageTile categoryId={categoryId} uri={thumbnailUrl} width={width} height={height} />
      {interactionTag ?? null}
      <OfferCaption
        name={name}
        date={date}
        price={price}
        categoryLabel={categoryLabel}
        distance={distance}
        width={width}
      />
    </Container>
  )
}

const Container = styled(ViewGap).attrs<{ gap?: number }>({
  gap: 2,
})<{ maxWidth: number }>(({ maxWidth }) => ({
  maxWidth,
}))
