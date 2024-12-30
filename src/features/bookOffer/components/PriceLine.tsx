import React from 'react'

import { OfferStockResponse } from 'api/gen'
import { useGetPacificFrancToEuroRate } from 'libs/firebase/firestore/exchangeRates/useGetPacificFrancToEuroRate'
import { formatCurrencyFromCents } from 'shared/currency/formatCurrencyFromCents'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { Typo } from 'ui/theme'

interface PriceLineProps {
  quantity?: number
  unitPrice: number
  label?: OfferStockResponse['priceCategoryLabel']
  shouldDisabledStyles?: boolean
  attributes?: OfferStockResponse['features']
}

export function PriceLine({
  quantity = 1,
  unitPrice,
  label,
  shouldDisabledStyles = false,
  attributes,
}: PriceLineProps) {
  const currency = useGetCurrencyToDisplay()
  const euroToPacificFrancRate = useGetPacificFrancToEuroRate()
  const totalPrice = formatCurrencyFromCents(quantity * unitPrice, currency, euroToPacificFrancRate)
  const price = formatCurrencyFromCents(unitPrice, currency, euroToPacificFrancRate)

  const MainText = shouldDisabledStyles ? Typo.Body : Typo.Caption
  const SecondaryText = shouldDisabledStyles ? Typo.Body : Typo.CaptionNeutralInfo

  const shouldDisplayAttributes = attributes?.length

  return (
    <Typo.Body>
      <MainText>{totalPrice} </MainText>

      {quantity > 1 ? (
        <SecondaryText testID="price-line-price-detail">
          ({price} x {quantity} places)
        </SecondaryText>
      ) : null}

      {label ? <MainText testID="price-line-label"> - {label}</MainText> : null}

      {shouldDisplayAttributes ? (
        <MainText testID="price-line-attributes"> - {attributes.join(' ')}</MainText>
      ) : null}
    </Typo.Body>
  )
}
