import React, { useMemo } from 'react'
import { View } from 'react-native'

import { OfferStockResponse } from 'api/gen'
import { Step } from 'features/bookOffer/context/reducer'
import { useBookingContext } from 'features/bookOffer/context/useBookingContext'
import {
  getHourWording,
  getSortedHoursFromDate,
  getStockSortedByPriceFromHour,
  getStockWithCategoryFromDate,
} from 'features/bookOffer/helpers/bookingHelpers/bookingHelpers'
import { useBookingStock } from 'features/bookOffer/helpers/useBookingStock'
import { formatHour, formatToKeyDate } from 'features/bookOffer/helpers/utils'
import { useCreditForOffer } from 'features/offer/helpers/useHasEnoughCredit/useHasEnoughCredit'
import { useBookingOfferQuery } from 'queries/offer/useBookingOfferQuery'
import { usePacificFrancToEuroRate } from 'queries/settings/useSettings'
import { Currency, useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { RadioButtonGroup } from 'ui/designSystem/RadioButtonGroup/RadioButtonGroup'
import { RadioButtonGroupOption } from 'ui/designSystem/RadioButtonGroup/types'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

const radioGroupLabel = 'Horaires'

const getHourChoiceForMultiplePrices = (
  stocks: OfferStockResponse[],
  selectedDate: string | undefined,
  offerCredit: number,
  currency: Currency,
  euroToPacificFrancRate: number
) => {
  const sortedHoursFromDate = getSortedHoursFromDate(stocks, selectedDate)
  const distinctHours: string[] = [...new Set(sortedHoursFromDate)]
  return distinctHours.map((hour) => {
    const filteredAvailableStocksFromHour = getStockSortedByPriceFromHour(stocks, hour)
    const filteredAvailableStocksFromHourBookable = filteredAvailableStocksFromHour.filter(
      (stock) => stock.isBookable
    )
    const stocksToGetMinPrice =
      filteredAvailableStocksFromHourBookable.length > 0
        ? filteredAvailableStocksFromHourBookable
        : filteredAvailableStocksFromHour
    const minPriceStock = stocksToGetMinPrice.reduce(
      (acc, curr) => {
        if (acc.price < curr.price) return acc
        return curr
      },
      stocksToGetMinPrice[0] || { price: Infinity, features: [] }
    )

    const isBookable = filteredAvailableStocksFromHourBookable.length > 0
    const hasSeveralPrices = filteredAvailableStocksFromHour.length > 1
    const enoughCredit = minPriceStock.price <= offerCredit
    const priceWording = getHourWording(
      minPriceStock.price,
      isBookable,
      enoughCredit,
      currency,
      euroToPacificFrancRate,
      hasSeveralPrices
    )
    const joinedFeatures = minPriceStock.features.join(' ')
    return {
      key: hour,
      label: formatHour(hour).replace(':', 'h'),
      description: [joinedFeatures, priceWording].filter(Boolean).join(' - '),
      disabled: !isBookable || !enoughCredit,
    }
  })
}

const getHourChoiceForSingleStock = (
  stocks: OfferStockResponse[],
  selectedDate: string | undefined,
  offerCredit: number,
  currency: Currency,
  euroToPacificFrancRate: number
) =>
  stocks
    .filter(({ beginningDatetime }) => {
      if (beginningDatetime === undefined || beginningDatetime === null) return false
      return selectedDate && beginningDatetime
        ? formatToKeyDate(beginningDatetime) === selectedDate
        : false
    })
    .sort(
      (a, b) =>
        //@ts-expect-error : stocks with no beginningDatetime was filtered
        new Date(a.beginningDatetime).getTime() - new Date(b.beginningDatetime).getTime()
    )
    .map((stock) => {
      const enoughCredit = stock.price <= offerCredit
      const priceWording = getHourWording(
        stock.price,
        stock.isBookable,
        enoughCredit,
        currency,
        euroToPacificFrancRate
      )
      const joinedFeatures = stock.features.join(' ')
      return {
        key: stock.id.toString(),
        label: formatHour(stock.beginningDatetime).replace(':', 'h'),
        description: [joinedFeatures, priceWording].filter(Boolean).join(' - '),
        disabled: !stock.isBookable || !enoughCredit,
      }
    })

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

  const options: Array<RadioButtonGroupOption> = useMemo(() => {
    if (hasPotentialPricesStep) {
      return getHourChoiceForMultiplePrices(
        stocks,
        selectedDate,
        offerCredit,
        currency,
        euroToPacificFrancRate
      )
    } else {
      return getHourChoiceForSingleStock(
        stocks,
        selectedDate,
        offerCredit,
        currency,
        euroToPacificFrancRate
      )
    }
  }, [stocks, selectedDate, offerCredit, hasPotentialPricesStep, currency, euroToPacificFrancRate])

  const buttonTitle = bookingStock?.beginningDatetime
    ? formatHour(bookingStock.beginningDatetime)
    : ''
  const selectedStock = stocks.find((stock) => stock.id === bookingState.stockId)
  const selectedValue = hasPotentialPricesStep
    ? bookingState.hour
      ? formatHour(bookingState.hour).replace(':', 'h')
      : ''
    : selectedStock?.beginningDatetime
      ? formatHour(selectedStock.beginningDatetime).replace(':', 'h')
      : ''

  const handleChange = (selectedLabel: string) => {
    if (hasPotentialPricesStep) {
      const sortedHoursFromDate = getSortedHoursFromDate(stocks, selectedDate)
      const hour = [...new Set(sortedHoursFromDate)].find(
        (hour) => formatHour(hour).replace(':', 'h') === selectedLabel
      )
      if (!hour) return
      selectHour(hour, getStockSortedByPriceFromHour(stocks, hour))
      return
    }

    const stock = stocks
      .filter(({ beginningDatetime }) => {
        if (!beginningDatetime) return false
        return selectedDate ? formatToKeyDate(beginningDatetime) === selectedDate : false
      })
      .find(
        (stock) =>
          stock.beginningDatetime &&
          formatHour(stock.beginningDatetime).replace(':', 'h') === selectedLabel
      )
    if (!stock) return
    dispatch({ type: 'SELECT_HOUR', payload: stock.beginningDatetime ?? '' })
    selectStock(stock.id)
  }

  return bookingState.step === Step.HOUR ? (
    <View testID="HourStep">
      <RadioButtonGroup
        label={radioGroupLabel}
        labelVariant="title3"
        options={options}
        value={selectedValue}
        onChange={handleChange}
        variant="detailed"
        display="vertical"
      />
    </View>
  ) : (
    <ViewGap gap={4}>
      <Typo.Title3 {...getHeadingAttrs(3)}>{radioGroupLabel}</Typo.Title3>
      <TouchableOpacity onPress={changeHour}>
        <Typo.Button>{buttonTitle}</Typo.Button>
      </TouchableOpacity>
    </ViewGap>
  )
}
