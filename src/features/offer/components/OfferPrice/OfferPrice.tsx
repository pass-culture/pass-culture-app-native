import React from 'react'

import { getDisplayPrice } from 'libs/parsers/getDisplayPrice'
import { TypoDS } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

interface Props {
  prices: number[]
}

export function OfferPrice({ prices }: Readonly<Props>) {
  return (
    <TypoDS.Title3 {...getHeadingAttrs(2)}>
      {getDisplayPrice(prices, { fractionDigits: 2 })}
    </TypoDS.Title3>
  )
}
