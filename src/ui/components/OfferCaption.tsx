import React, { FC, Fragment } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { formatDistanceDate } from 'libs/parsers/formatDistanceDate'
import { useFontScaleValue } from 'shared/accessibility/useFontScaleValue'
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
  const categoryLabelNumberOfLines = useFontScaleValue({ default: 1, at200PercentZoom: 3 })
  const nameNumberOfLines = useFontScaleValue({ default: 2, at200PercentZoom: 4 })
  const distanceDateNumberOfLines = useFontScaleValue({ default: 1, at200PercentZoom: 4 })

  const distanceDate = formatDistanceDate(width, distance, date)

  return (
    <Fragment>
      <View>
        <CategoryLabel numberOfLines={categoryLabelNumberOfLines}>{categoryLabel}</CategoryLabel>
        <Typo.BodyAccentXs numberOfLines={nameNumberOfLines}>{name}</Typo.BodyAccentXs>
      </View>
      <View>
        <Typo.BodyXs testID="priceIsDuo">{price}</Typo.BodyXs>
        {distanceDate ? (
          <DateText numberOfLines={distanceDateNumberOfLines}>{distanceDate}</DateText>
        ) : null}
      </View>
    </Fragment>
  )
}

const CategoryLabel = styled(Typo.BodyXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))

const DateText = styled(Typo.BodyXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))
