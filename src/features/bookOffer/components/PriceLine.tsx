import React from 'react'

import { OfferStockResponse } from 'api/gen'
import { formatToFrenchDecimal } from 'libs/parsers'
import { Typo } from 'ui/theme'

export interface PriceLineProps {
  /**
   * Ordered quantity.
   * @default 1
   */
  quantity?: number
  /**
   * Offer stock unit price.
   */
  unitPrice: number
  /**
   * Offer stock price category label.
   */
  label?: OfferStockResponse['priceCategoryLabel']
}

export function PriceLine({ quantity = 1, unitPrice, label }: PriceLineProps) {
  const totalPrice = formatToFrenchDecimal(quantity * unitPrice)

  return (
    <React.Fragment>
      <Typo.Caption>{totalPrice} </Typo.Caption>

      {quantity > 1 && (
        <React.Fragment>
          <Typo.CaptionNeutralInfo>
            ({formatToFrenchDecimal(unitPrice)} x {quantity} places)
          </Typo.CaptionNeutralInfo>
        </React.Fragment>
      )}

      {!!label && <Typo.Caption> - {label}</Typo.Caption>}
    </React.Fragment>
  )
}
