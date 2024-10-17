import React from 'react'

import { getDisplayPrice } from 'libs/parsers/getDisplayPrice'
import { TypoDS } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'
import { useGetCurrentCurrency } from 'libs/parsers/useGetCurrentCurrency'
import { useGetEuroToXPFRate } from 'libs/parsers/useGetEuroToXPFRate'

interface Props {
  prices: number[]
}

export function OfferPrice({ prices }: Readonly<Props>) {
  const currency = useGetCurrentCurrency()
  const euroToXPFRate = useGetEuroToXPFRate()

  return (
    <TypoDS.Title3 {...getHeadingAttrs(2)}>
      {getDisplayPrice(prices, currency, euroToXPFRate, { fractionDigits: 2 })}
    </TypoDS.Title3>
  )
}
