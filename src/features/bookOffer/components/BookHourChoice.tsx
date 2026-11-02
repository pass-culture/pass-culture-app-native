import React, { useMemo } from 'react'
import { View } from 'react-native'

import { OfferStockResponse } from 'api/gen'
import { Step } from 'features/bookOffer/context/reducer'
import { useBookingContext } from 'features/bookOffer/context/useBookingContext'
import {
  getStockSortedByPriceFromHour,
  getStockWithCategoryFromDate,
} from 'features/bookOffer/helpers/bookingHelpers/bookingHelpers'
import { getHourChoiceForMultiplePrices } from 'features/bookOffer/helpers/getHourChoiceForMultiplePrices'
import { getHourChoiceForSingleStock } from 'features/bookOffer/helpers/getHourChoiceForSingleStock'
import { useBookingStock } from 'features/bookOffer/helpers/useBookingStock'
import { formatHour, formatToKeyDate } from 'features/bookOffer/helpers/utils'
import { useCreditForOffer } from 'features/offer/helpers/useHasEnoughCredit/useHasEnoughCredit'
import { useBookingOfferQuery } from 'queries/offer/useBookingOfferQuery'
import { usePacificFrancToEuroRate } from 'queries/settings/useSettings'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { RadioButtonGroup } from 'ui/designSystem/RadioButtonGroup/RadioButtonGroup'
import { Typo } from 'ui/theme'
import { setTextSemantic } from 'ui/theme/typographyAttrs/setTextSemantic'

const radioGroupLabel = 'Horaires'

export const BookHourChoice = () => {
  const { bookingState, dispatch } = useBookingContext()
  const { isDuo, stocks = [] } = useBookingOfferQuery() ?? {}
  const bookingStock = useBookingStock()
  const offerCredit = useCreditForOffer(bookingState.offerId)
  const currency = useGetCurrencyToDisplay()
  const { data: euroToPacificFrancRate } = usePacificFrancToEuroRate()

  const selectedDate = bookingState.date ? formatToKeyDate(bookingState.date) : undefined
  const hasPotentialPricesStep =
    stocks.filter(getStockWithCategoryFromDate(selectedDate)).length > 1
  const selectStock = (stockId: number) => {
    dispatch({ type: 'SELECT_STOCK', payload: stockId })
    if (!isDuo) {
      dispatch({ type: 'SELECT_QUANTITY', payload: 1 })
    }
  }

  const selectHour = (hour: string, stockFromHour: OfferStockResponse[]) => {
    dispatch({ type: 'SELECT_HOUR', payload: hour })
    if (stockFromHour.length === 1 && stockFromHour[0]) {
      dispatch({ type: 'SELECT_STOCK', payload: stockFromHour[0].id })
    }
    if (!isDuo) {
      dispatch({ type: 'SELECT_QUANTITY', payload: 1 })
    }
  }

  const changeHour = () => {
    dispatch({ type: 'CHANGE_STEP', payload: Step.HOUR })
  }

  const options = useMemo(
    () =>
      hasPotentialPricesStep
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
          ),
    [stocks, selectedDate, offerCredit, hasPotentialPricesStep, currency, euroToPacificFrancRate]
  )

  const buttonTitle = bookingStock?.beginningDatetime
    ? formatHour(bookingStock.beginningDatetime)
    : ''
  const selectedOptionKey = hasPotentialPricesStep
    ? (bookingState.hour ?? '')
    : (bookingState.stockId?.toString() ?? '')

  const handleChange = (selectedKey: string) => {
    if (hasPotentialPricesStep) {
      selectHour(selectedKey, getStockSortedByPriceFromHour(stocks, selectedKey))
      return
    }

    const stock = stocks.find(({ id }) => id.toString() === selectedKey)
    if (!stock?.beginningDatetime) return

    dispatch({ type: 'SELECT_HOUR', payload: stock.beginningDatetime })
    selectStock(stock.id)
  }

  return bookingState.step === Step.HOUR ? (
    <View testID="HourStep">
      <RadioButtonGroup
        label={radioGroupLabel}
        labelVariant="title3"
        options={options}
        value={selectedOptionKey}
        onChange={handleChange}
        variant="detailed"
        display="vertical"
      />
    </View>
  ) : (
    <ViewGap gap={4}>
      <Typo.Title3 {...setTextSemantic('h3')}>{radioGroupLabel}</Typo.Title3>
      <TouchableOpacity onPress={changeHour}>
        <Typo.Button>{buttonTitle}</Typo.Button>
      </TouchableOpacity>
    </ViewGap>
  )
}
