import React from 'react'
import { View } from 'react-native'

import { BookingStockSelection } from 'features/bookCinemaOffer/types'
import {
  getPriceWording,
  getStockSortedByPriceFromHour,
} from 'features/bookOffer/helpers/bookingHelpers/bookingHelpers'
import { useCreditForOffer } from 'features/offer/helpers/useHasEnoughCredit/useHasEnoughCredit'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { useOfferQuery } from 'queries/offer/useOfferQuery'
import { usePacificFrancToEuroRate } from 'queries/settings/useSettings'
import { formatCurrencyFromCents } from 'shared/currency/formatCurrencyFromCents'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { RadioButtonGroup } from 'ui/designSystem/RadioButtonGroup/RadioButtonGroup'

type Props = {
  offerId: number
  selectedHour?: string
  selectedStockId?: number
  onSelectStock: (selection: BookingStockSelection) => void
}

export const BookingPriceStep: React.FC<Props> = ({
  offerId,
  selectedHour = '',
  selectedStockId,
  onSelectStock,
}) => {
  const { data: offer } = useOfferQuery({ offerId })
  const offerCredit = useCreditForOffer(offerId)
  const currency = useGetCurrencyToDisplay()
  const { data: euroToPacificFrancRate } = usePacificFrancToEuroRate()
  const stocks = offer?.stocks ?? []
  const stocksAtSelectedHour = stocks.filter(
    (stock) => !stock.isExpired && stock.beginningDatetime === selectedHour
  )
  const hasPriceCategories = stocksAtSelectedHour.some((stock) => stock.priceCategoryLabel)
  const filteredStocks = hasPriceCategories
    ? getStockSortedByPriceFromHour(stocksAtSelectedHour, selectedHour)
    : [...stocksAtSelectedHour].sort((a, b) => b.price - a.price)

  if (!offer) return null

  const priceOptions = filteredStocks.map((stock) => {
    const priceWording = formatCurrencyFromCents(stock.price, currency, euroToPacificFrancRate)
    const statusWording = getPriceWording(stock, offerCredit)
    const label = stock.priceCategoryLabel ?? priceWording
    return {
      key: stock.id.toString(),
      label,
      description: [stock.priceCategoryLabel ? priceWording : undefined, statusWording]
        .filter(Boolean)
        .join(' - '),
      disabled: stock.isSoldOut || stock.price > offerCredit,
    }
  })

  const selectedOption = priceOptions.find((option) => option.key === selectedStockId?.toString())

  const handleChange = (selectedLabel: string) => {
    const option = priceOptions.find((candidate) => candidate.label === selectedLabel)
    const stock = filteredStocks.find(({ id }) => id.toString() === option?.key)
    if (!stock?.beginningDatetime) return
    onSelectStock({
      stockId: stock.id,
      hour: stock.beginningDatetime,
    })
  }

  return (
    <View testID="BookingPriceStep" accessibilityRole={AccessibilityRole.RADIOGROUP}>
      <RadioButtonGroup
        label="Prix"
        labelVariant="title3"
        options={priceOptions}
        value={selectedOption?.label ?? ''}
        onChange={handleChange}
        variant="detailed"
        display="vertical"
      />
    </View>
  )
}
