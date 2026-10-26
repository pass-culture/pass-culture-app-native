import React from 'react'
import { View } from 'react-native'

import { BookingStockSelection } from 'features/bookCinemaOffer/types'
import {
  getStockSortedByPriceFromHour,
  getStockWithCategoryFromDate,
} from 'features/bookOffer/helpers/bookingHelpers/bookingHelpers'
import { getHourChoiceForMultiplePrices } from 'features/bookOffer/helpers/getHourChoiceForMultiplePrices'
import { getHourChoiceForSingleStock } from 'features/bookOffer/helpers/getHourChoiceForSingleStock'
import { useCreditForOffer } from 'features/offer/helpers/useHasEnoughCredit/useHasEnoughCredit'
import { useOfferQuery } from 'queries/offer/useOfferQuery'
import { usePacificFrancToEuroRate } from 'queries/settings/useSettings'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { RadioButtonGroup } from 'ui/designSystem/RadioButtonGroup/RadioButtonGroup'

type Props = {
  offerId: number
  selectedDate?: string
  selectedHour?: string
  selectedStockId?: number
  onSelectHour: (hour: string) => void
  onSelectStock: (selection: BookingStockSelection) => void
}

export const BookingHourStep: React.FC<Props> = ({
  offerId,
  selectedDate,
  selectedHour,
  selectedStockId,
  onSelectHour,
  onSelectStock,
}) => {
  const { data: offer } = useOfferQuery({ offerId })
  const offerCredit = useCreditForOffer(offerId)
  const currency = useGetCurrencyToDisplay()
  const { data: euroToPacificFrancRate } = usePacificFrancToEuroRate()
  const stocks = offer?.stocks ?? []
  const hasPotentialPricesStep =
    stocks.filter(getStockWithCategoryFromDate(selectedDate)).length > 1
  const options = hasPotentialPricesStep
    ? getHourChoiceForMultiplePrices(
        stocks,
        selectedDate,
        offerCredit,
        currency,
        euroToPacificFrancRate
      )
    : getHourChoiceForSingleStock(
        stocks,
        selectedDate,
        offerCredit,
        currency,
        euroToPacificFrancRate
      )

  if (!offer) return null

  const selectedOptionKey = hasPotentialPricesStep ? selectedHour : selectedStockId?.toString()
  const selectedValue = options.find((option) => option.key === selectedOptionKey)?.label ?? ''

  const handleChange = (selectedLabel: string) => {
    const selectedOption = options.find((option) => option.label === selectedLabel)
    if (!selectedOption) return

    if (hasPotentialPricesStep) {
      const hour = selectedOption.key
      const stocksFromHour = getStockSortedByPriceFromHour(stocks, hour)
      onSelectHour(hour)
      if (stocksFromHour.length === 1 && stocksFromHour[0]) {
        const stock = stocksFromHour[0]
        onSelectStock({
          stockId: stock.id,
          hour: stock.beginningDatetime ?? hour,
        })
      }
      return
    }

    const stock = stocks.find(({ id }) => id.toString() === selectedOption.key)
    if (!stock?.beginningDatetime) return

    onSelectStock({
      stockId: stock.id,
      hour: stock.beginningDatetime,
    })
  }

  return (
    <View testID="BookingHourStep">
      <RadioButtonGroup
        label="Horaires"
        labelVariant="title3"
        options={options}
        value={selectedValue}
        onChange={handleChange}
        variant="detailed"
        display="vertical"
      />
    </View>
  )
}
