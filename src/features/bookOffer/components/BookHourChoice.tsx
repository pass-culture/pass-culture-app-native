import React, { useMemo } from 'react'
import { View } from 'react-native'

import { OfferStockResponse, OfferVenueResponse } from 'api/gen'
import { HourChoice } from 'features/bookOffer/components/HourChoice'
import { BookingState, Step } from 'features/bookOffer/context/reducer'
import { useBookingContext } from 'features/bookOffer/context/useBookingContext'
import {
  getSortedHoursFromDate,
  getStockSortedByPriceFromHour,
  getStockWithCategoryFromDate,
} from 'features/bookOffer/helpers/bookingHelpers/bookingHelpers'
import { useBookingStock } from 'features/bookOffer/helpers/useBookingStock'
import { formatHour, formatToKeyDate } from 'features/bookOffer/helpers/utils'
import { useCreditForOffer } from 'features/offer/helpers/useHasEnoughCredit/useHasEnoughCredit'
import { useBookingOfferQuery } from 'queries/offer/useBookingOfferQuery'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

const radioGroupLabel = 'Horaires'

function getHourChoiceForMultiplePrices(
  stocks: OfferStockResponse[],
  selectedDate: string | undefined,
  bookingState: BookingState,
  selectHour: (hour: string, stockFromHour: OfferStockResponse[]) => void,
  offerCredit: number
) {
  const sortedHoursFromDate = getSortedHoursFromDate(stocks, selectedDate)
  const distinctHours: string[] = [...new Set(sortedHoursFromDate)]
  return distinctHours.map((hour, index) => {
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
    return (
      <HourChoice
        radioGroupLabel={radioGroupLabel}
        index={index}
        key={hour}
        price={minPriceStock.price}
        hour={formatHour(hour).replace(':', 'h')}
        selected={hour === bookingState.hour}
        onPress={() => selectHour(hour, filteredAvailableStocksFromHour)}
        testID={`HourChoice${hour}`}
        isBookable={isBookable}
        offerCredit={offerCredit}
        hasSeveralPrices={hasSeveralPrices}
        features={minPriceStock.features}
      />
    )
  })
}

function getHourChoiceForSingleStock(
  stocks: OfferStockResponse[],
  selectedDate: string | undefined,
  venue: OfferVenueResponse | undefined,
  bookingState: BookingState,
  selectStock: (stockId: number) => void,
  offerCredit: number
) {
  return stocks
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
    .map((stock, index) => (
      <HourChoice
        radioGroupLabel={radioGroupLabel}
        index={index}
        key={stock.id}
        price={stock.price}
        hour={formatHour(stock.beginningDatetime, venue?.timezone).replace(':', 'h')}
        selected={stock.id === bookingState.stockId}
        onPress={() => selectStock(stock.id)}
        testID={`HourChoice${stock.id}`}
        isBookable={stock.isBookable}
        offerCredit={offerCredit}
        features={stock.features}
      />
    ))
}

export const BookHourChoice = () => {
  const { bookingState, dispatch } = useBookingContext()
  const { isDuo, stocks = [], venue } = useBookingOfferQuery() ?? {}
  const bookingStock = useBookingStock()
  const offerCredit = useCreditForOffer(bookingState.offerId)

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

  const filteredStocks = useMemo(
    () => {
      if (hasPotentialPricesStep) {
        return getHourChoiceForMultiplePrices(
          stocks,
          selectedDate,
          bookingState,
          selectHour,
          offerCredit
        )
      } else {
        return getHourChoiceForSingleStock(
          stocks,
          selectedDate,
          venue,
          bookingState,
          selectStock,
          offerCredit
        )
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      stocks,
      selectedDate,
      bookingState.hour,
      bookingState.stockId,
      bookingState.quantity,
      offerCredit,
      hasPotentialPricesStep,
    ]
  )

  const buttonTitle = bookingStock?.beginningDatetime
    ? formatHour(bookingStock.beginningDatetime)
    : ''

  return (
    <ViewGap gap={4}>
      <Typo.Title3 {...getHeadingAttrs(3)} testID="HourStep">
        {radioGroupLabel}
      </Typo.Title3>

      {bookingState.step === Step.HOUR ? (
        <View>{filteredStocks}</View>
      ) : (
        <TouchableOpacity onPress={changeHour}>
          <Typo.Button>{buttonTitle}</Typo.Button>
        </TouchableOpacity>
      )}
    </ViewGap>
  )
}
