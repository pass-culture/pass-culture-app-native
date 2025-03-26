import React, { FC } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { CategoryIdEnum } from 'api/gen'
import { ImageTile } from 'ui/components/ImageTile'
import { NewOfferCaption } from 'ui/components/NewOfferCaption'
import { Tag } from 'ui/components/Tag/Tag'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { ThumbUpFilled } from 'ui/svg/icons/ThumbUpFilled'
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
  likes?: number
}

const renderTags = ({ distance = '', likes = 0 }: { distance?: string; likes?: number }) => {
  if (!distance && !likes) {
    return null
  }
  return (
    <TagContainer>
      {distance ? <DistanceTag label={`à ${distance}`} /> : null}
      {likes ? <LikeTag label={likes.toString()} /> : null}
    </TagContainer>
  )
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
  likes,
}) => {
  return (
    <Container maxWidth={width}>
      <NewOfferCaption name={name} date={date} price={price} categoryLabel={categoryLabel} />
      <View>
        {renderTags({ distance, likes })}
        <ImageTile categoryId={categoryId} uri={thumbnailUrl} width={width} height={height} />
      </View>
    </Container>
  )
}

const Container = styled(ViewGap).attrs({
  gap: 2,
})<{ maxWidth: number }>(({ maxWidth }) => ({
  flexDirection: 'column-reverse',
  maxWidth,
}))

const TagContainer = styled.View({
  position: 'absolute',
  width: '100%',
  padding: getSpacing(2),
  columnGap: getSpacing(2),
  top: 0,
  left: 0,
  zIndex: 1,
  flexDirection: 'row',
})

const DistanceTag = styled(Tag).attrs(() => ({
  testID: 'DistanceId',
}))(({ theme }) => ({
  backgroundColor: theme.colors.white,
}))

const CustomThumbUp = styled(ThumbUpFilled).attrs(({ theme }) => ({
  size: getSpacing(4),
  color: theme.colors.primary,
}))``

const LikeTag = styled(Tag).attrs(() => ({
  Icon: CustomThumbUp,
}))(({ theme }) => ({
  backgroundColor: theme.colors.white,
}))
