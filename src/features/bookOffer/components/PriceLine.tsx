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

const testIDPrefix = 'price-line'
function getTestID(str: string) {
  return `${testIDPrefix}__${str}`
}

export function PriceLine({ quantity = 1, unitPrice, label }: PriceLineProps) {
  const totalPrice = formatToFrenchDecimal(quantity * unitPrice)

  return (
    <React.Fragment>
      <Typo.Caption>{totalPrice} </Typo.Caption>

      {quantity > 1 && (
        <Typo.CaptionNeutralInfo testID={getTestID('price-detail')}>
          ({formatToFrenchDecimal(unitPrice)} x {quantity} places)
        </Typo.CaptionNeutralInfo>
      )}

      {!!label && <Typo.Caption testID={getTestID('label')}> - {label}</Typo.Caption>}
    </React.Fragment>
  )
}
