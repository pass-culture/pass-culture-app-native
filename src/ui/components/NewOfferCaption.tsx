import React, { FC } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { Typo } from 'ui/theme'

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
      <Typo.CaptionNeutralInfo>{categoryLabel}</Typo.CaptionNeutralInfo>
      <View>
        <OfferText>{name}</OfferText>
        {date ? <DateText>{date}</DateText> : null}
        <Typo.Caption testID="priceIsDuo">{priceText}</Typo.Caption>
      </View>
    </ViewGap>
  )
}

const OfferText = styled(Typo.Caption).attrs({
  numberOfLines: 2,
})({})
const DateText = styled(Typo.Caption).attrs({
  numberOfLines: 1,
})({})
