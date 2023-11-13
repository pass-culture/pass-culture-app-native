import React from 'react'

import { getDisplayPrice } from 'libs/parsers'
import { Typo } from 'ui/theme'

interface Props {
  prices: number[]
}

export function OfferPrice({ prices }: Readonly<Props>) {
  return <Typo.Title1>{getDisplayPrice(prices, true)}</Typo.Title1>
}
