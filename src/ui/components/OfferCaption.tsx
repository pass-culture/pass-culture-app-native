import React, { FC, Fragment } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { formatDistanceDate } from 'libs/parsers/formatDistanceDate'
import { Typo } from 'ui/theme'

type Props = {
  name?: string
  date?: string
  price: string
  categoryLabel: string | null
  distance?: string
  width: number
}

export const OfferCaption: FC<Props> = ({
  name,
  date,
  price,
  categoryLabel,
  distance,
  width,
}: Props) => {
  const distanceDate = formatDistanceDate(width, distance, date)

  return (
    <Fragment>
      <View>
        <CategoryLabel>{categoryLabel}</CategoryLabel>
        <OfferText>{name}</OfferText>
      </View>
      <View>
        <Typo.BodyXs testID="priceIsDuo">{price}</Typo.BodyXs>
        {distanceDate ? <DateText>{distanceDate}</DateText> : null}
      </View>
    </Fragment>
  )
}

const CategoryLabel = styled(Typo.BodyXs).attrs({
  numberOfLines: 1,
})(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))

const OfferText = styled(Typo.BodyAccentXs).attrs({
  numberOfLines: 2,
})({})

const DateText = styled(Typo.BodyXs).attrs({
  numberOfLines: 1,
})(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))
