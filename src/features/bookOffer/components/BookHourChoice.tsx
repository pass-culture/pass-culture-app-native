import debounce from 'lodash/debounce'
import React, { useMemo, useRef } from 'react'
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
import { useBookingOffer } from 'features/bookOffer/helpers/useBookingOffer'
import { useBookingStock } from 'features/bookOffer/helpers/useBookingStock'
import { formatHour, formatToKeyDate } from 'features/bookOffer/helpers/utils'
import { useCreditForOffer } from 'features/offer/helpers/useHasEnoughCredit/useHasEnoughCredit'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { Typo, Spacer } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

interface Props {
  enablePricesByCategories?: boolean
}

function getHourChoiceWhenMultiplePrices(
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
    const minPriceStock = stocksToGetMinPrice.reduce((acc, curr) => {
      if (acc.price < curr.price) return acc
      return curr
    })

    const isBookable = filteredAvailableStocksFromHourBookable.length > 0
    const hasSeveralPrices = filteredAvailableStocksFromHour.length > 1
    return (
      <HourChoice
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

export const BookHourChoice = ({ enablePricesByCategories }: Props) => {
  const { bookingState, dispatch } = useBookingContext()
  const { isDuo, stocks = [], venue } = useBookingOffer() ?? {}
  const bookingStock = useBookingStock()
  const offerCredit = useCreditForOffer(bookingState.offerId)
  const debouncedDispatch = useRef(debounce(dispatch, 300)).current

  const selectedDate = bookingState.date ? formatToKeyDate(bookingState.date) : undefined
  const hasPotentialPricesStep =
    enablePricesByCategories && stocks.filter(getStockWithCategoryFromDate(selectedDate)).length > 1
  const selectStock = (stockId: number) => {
    dispatch({ type: 'SELECT_STOCK', payload: stockId })
    if (!isDuo) {
      dispatch({ type: 'SELECT_QUANTITY', payload: 1 })
    }
    if (enablePricesByCategories) return

    if (bookingState.quantity) {
      debouncedDispatch({ type: 'CHANGE_STEP', payload: Step.PRE_VALIDATION })
    } else {
      debouncedDispatch({ type: 'CHANGE_STEP', payload: Step.DUO })
    }
  }

  const selectHour = (hour: string, stockFromHour: OfferStockResponse[]) => {
    dispatch({ type: 'SELECT_HOUR', payload: hour })
    if (stockFromHour.length === 1) {
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
        return getHourChoiceWhenMultiplePrices(
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
    <React.Fragment>
      {enablePricesByCategories ? (
        <Typo.Title3 {...getHeadingAttrs(3)} testID="HourStep">
          Horaire
        </Typo.Title3>
      ) : (
        <Typo.Title4 {...getHeadingAttrs(2)} testID="HourStep">
          Horaire
        </Typo.Title4>
      )}

      <Spacer.Column numberOfSpaces={4} />
      {bookingState.step === Step.HOUR ? (
        <View>{filteredStocks}</View>
      ) : (
        <TouchableOpacity onPress={changeHour}>
          <Typo.ButtonText>{buttonTitle}</Typo.ButtonText>
        </TouchableOpacity>
      )}
    </React.Fragment>
  )
}
