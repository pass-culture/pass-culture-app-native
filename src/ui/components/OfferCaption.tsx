import React, { FC, Fragment } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { formatDistanceDate } from 'libs/parsers/formatDistanceDate'
import { useNumberOfLine } from 'shared/accessibility/helpers/zoomHelpers'
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
  const distanceDateNumberOfLines = useNumberOfLine(1)
  const distanceDate = formatDistanceDate(width, distance, date)

  return (
    <Fragment>
      <View>
        <CategoryLabel numberOfLines={useNumberOfLine(1)}>{categoryLabel}</CategoryLabel>
        <Typo.BodyAccentXs numberOfLines={useNumberOfLine(2)}>{name}</Typo.BodyAccentXs>
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
