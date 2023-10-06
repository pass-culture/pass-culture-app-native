import React from 'react'

import { OfferStockResponse } from 'api/gen'
import { formatToFrenchDecimal } from 'libs/parsers'
import { Typo } from 'ui/theme'

interface PriceLineProps {
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
  /**
   * By default, this component displays information in `Typo` components in order to get
   * correct styling for `<BookingInformations />` component.
   *
   * By setting this to `true` you can disable the styling.
   *
   * @default false
   */
  shouldDisabledStyles?: boolean
  /**
   * Offer stock features refers to cinema's attributes
   */
  attributes?: OfferStockResponse['features']
}

const testIDPrefix = 'price-line'
function getTestID(str: string) {
  return `${testIDPrefix}__${str}`
}

export function PriceLine({
  quantity = 1,
  unitPrice,
  label,
  shouldDisabledStyles = false,
  attributes,
}: PriceLineProps) {
  const totalPrice = formatToFrenchDecimal(quantity * unitPrice)

  const MainText = shouldDisabledStyles ? Typo.Body : Typo.Caption
  const SecondaryText = shouldDisabledStyles ? Typo.Body : Typo.CaptionNeutralInfo

  const shouldDisplayAttributes = attributes?.length

  return (
    <Typo.Body>
      <MainText>{totalPrice} </MainText>

      {quantity > 1 && (
        <SecondaryText testID={getTestID('price-detail')}>
          ({formatToFrenchDecimal(unitPrice)} x {quantity} places)
        </SecondaryText>
      )}

      {!!label && <MainText testID={getTestID('label')}> - {label}</MainText>}

      {!!shouldDisplayAttributes && (
        <MainText testID={getTestID('attributes')}> - {attributes.join(' ')}</MainText>
      )}
    </Typo.Body>
  )
}
