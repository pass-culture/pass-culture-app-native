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

// IF we increase the height of the component (e.g., numberOfLines / number of items),
// we also need to update the OFFER_TILE_MAX_LINES variable in useComputedTheme.
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
        <TypoDS.BodyAccentXs testID="priceIsDuo">{priceText}</TypoDS.BodyAccentXs>
      </View>
    </ViewGap>
  )
}

const CategoryLabel = styled(TypoDS.BodyAccentXs).attrs({
  numberOfLines: 1,
})(({ theme }) => ({
  color: theme.colors.greyDark,
}))

const OfferText = styled(TypoDS.BodyAccentXs).attrs({
  numberOfLines: 2,
})({})
const DateText = styled(TypoDS.BodyAccentXs).attrs({
  numberOfLines: 1,
})({})
