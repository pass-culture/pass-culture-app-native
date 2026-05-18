import React from 'react'
import { View } from 'react-native'

import { OfferStockResponse } from 'api/gen'
import { useBookingContext } from 'features/bookOffer/context/useBookingContext'
import {
  getPriceWording,
  getStockSortedByPriceFromHour,
} from 'features/bookOffer/helpers/bookingHelpers/bookingHelpers'
import { useCreditForOffer } from 'features/offer/helpers/useHasEnoughCredit/useHasEnoughCredit'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { usePacificFrancToEuroRate } from 'queries/settings/useSettings'
import { formatCurrencyFromCents } from 'shared/currency/formatCurrencyFromCents'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { RadioButtonGroup } from 'ui/designSystem/RadioButtonGroup/RadioButtonGroup'
import { RadioButtonGroupOption } from 'ui/designSystem/RadioButtonGroup/types'

type Props = {
  stocks: OfferStockResponse[]
  isDuo?: boolean
}

export const BookPricesChoice = ({ stocks, isDuo }: Props) => {
  const { bookingState, dispatch } = useBookingContext()
  const offerCredit = useCreditForOffer(bookingState.offerId)
  const currency = useGetCurrencyToDisplay()
  const { data: euroToPacificFrancRate } = usePacificFrancToEuroRate()
  const selectedHour = bookingState.hour ?? ''

  const selectStock = (stockId: number) => {
    dispatch({ type: 'SELECT_STOCK', payload: stockId })
    if (!isDuo) {
      dispatch({ type: 'SELECT_QUANTITY', payload: 1 })
    }
  }

  const filteredStocks = getStockSortedByPriceFromHour(stocks, selectedHour)
  const radioGroupLabel = 'Prix'
  const selectedStock = filteredStocks.find((stock) => stock.id === bookingState.stockId)
  const options: Array<RadioButtonGroupOption> = filteredStocks.map((stock) => {
    const priceWording = formatCurrencyFromCents(stock.price, currency, euroToPacificFrancRate)
    const statusWording = getPriceWording(stock, offerCredit)
    return {
      key: stock.id.toString(),
      label: stock.priceCategoryLabel ?? '',
      description: [priceWording, statusWording].filter(Boolean).join(' - '),
      disabled: stock.isSoldOut || stock.price > offerCredit,
    }
  })

  const handleChange = (selectedLabel: string) => {
    const stock = filteredStocks.find((stock) => stock.priceCategoryLabel === selectedLabel)
    if (!stock) return
    selectStock(stock.id)
  }

  return (
    <View testID="PricesStep" accessibilityRole={AccessibilityRole.RADIOGROUP}>
      <RadioButtonGroup
        label={radioGroupLabel}
        labelVariant="title3"
        options={options}
        value={selectedStock?.priceCategoryLabel ?? ''}
        onChange={handleChange}
        variant="detailed"
        display="vertical"
      />
    </View>
  )
}
