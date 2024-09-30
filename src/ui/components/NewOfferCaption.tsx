import React, { FC } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { TypoDS } from 'ui/theme'

import { ViewGap } from './ViewGap/ViewGap'

type Props = {
  name?: string
  date?: string
  price: string
  categoryLabel: string | null
  isDuo?: boolean
  isBeneficiary?: boolean
}

export const NewOfferCaption: FC<Props> = ({
  name,
  date,
  price,
  categoryLabel,
  isDuo,
  isBeneficiary,
}: Props) => {
  const priceText = isDuo && isBeneficiary ? `${price} - Duo` : price
  return (
    <ViewGap gap={1}>
      <CategoryLabel>{categoryLabel}</CategoryLabel>
      <View>
        <OfferText>{name}</OfferText>
        {date ? <DateText>{date}</DateText> : null}
        <TypoDS.BodySemiBoldXs testID="priceIsDuo">{priceText}</TypoDS.BodySemiBoldXs>
      </View>
    </ViewGap>
  )
}

const CategoryLabel = styled(TypoDS.BodySemiBoldXs)(({ theme }) => ({
  color: theme.colors.greyDark,
}))

const OfferText = styled(TypoDS.BodySemiBoldXs).attrs({
  numberOfLines: 2,
})({})
const DateText = styled(TypoDS.BodySemiBoldXs).attrs({
  numberOfLines: 1,
})({})
