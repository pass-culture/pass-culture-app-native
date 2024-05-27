import React, { FC } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { getSpacing, Typo } from 'ui/theme'

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
    <Container>
      <Typo.CaptionNeutralInfo>{categoryLabel}</Typo.CaptionNeutralInfo>
      <View>
        <OfferText>{name}</OfferText>
        {date ? <DateText>{date}</DateText> : null}
        <Typo.Caption testID="priceIsDuo">{priceText}</Typo.Caption>
      </View>
    </Container>
  )
}

const Container = styled.View({
  gap: getSpacing(1),
})

const OfferText = styled(Typo.Caption).attrs({
  numberOfLines: 2,
})({})
const DateText = styled(Typo.Caption).attrs({
  numberOfLines: 1,
})({})
