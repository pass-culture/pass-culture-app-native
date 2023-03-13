import debounce from 'lodash/debounce'
import React, { useMemo, useRef } from 'react'
import styled from 'styled-components/native'

import { HourChoice } from 'features/bookOffer/components/HourChoice'
import { Step } from 'features/bookOffer/context/reducer'
import { useBookingContext } from 'features/bookOffer/context/useBookingContext'
import {
  getSortedHoursFromDate,
  getStockSortedByPriceFromHour,
} from 'features/bookOffer/helpers/bookingHelpers/bookingHelpers'
import { useBookingOffer } from 'features/bookOffer/helpers/useBookingOffer'
import { useBookingStock } from 'features/bookOffer/helpers/useBookingStock'
import { formatHour, formatToKeyDate } from 'features/bookOffer/helpers/utils'
import { useCreditForOffer } from 'features/offer/helpers/useHasEnoughCredit/useHasEnoughCredit'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { Typo, Spacer, getSpacing } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

interface Props {
  enablePricesByCategories?: boolean
}

export const BookHourChoice = ({ enablePricesByCategories }: Props) => {
  const { bookingState, dispatch } = useBookingContext()
  const { isDuo, stocks = [] } = useBookingOffer() || {}
  const bookingStock = useBookingStock()
  const offerCredit = useCreditForOffer(bookingState.offerId)
  const debouncedDispatch = useRef(debounce(dispatch, 300)).current
  const hasPricesStep =
    enablePricesByCategories && stocks.some((stock) => !stock.isExpired && stock.priceCategoryLabel)

  const selectedDate = bookingState.date ? formatToKeyDate(bookingState.date) : undefined
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

  const selectHour = (hour: string) => {
    dispatch({ type: 'SELECT_HOUR', payload: hour })
    if (!isDuo) {
      dispatch({ type: 'SELECT_QUANTITY', payload: 1 })
    }
  }

  const changeHour = () => {
    dispatch({ type: 'CHANGE_STEP', payload: Step.HOUR })
  }

  const filteredStocks = useMemo(
    () => {
      if (hasPricesStep) {
        const sortedHoursFromDate = getSortedHoursFromDate(stocks, selectedDate)
        const distinctHours: string[] = [...new Set(sortedHoursFromDate)]
        return distinctHours.map((hour) => {
          const filteredAvailableStocksFromHour = getStockSortedByPriceFromHour(stocks, hour)
          const minPrice = Math.min(...filteredAvailableStocksFromHour.map((stock) => stock.price))
          return (
            <HourChoice
              key={hour}
              price={minPrice}
              hour={formatHour(hour).replace(':', 'h')}
              selected={hour === bookingState.hour}
              onPress={() => selectHour(hour)}
              testID={`HourChoice${hour}`}
              isBookable
              offerCredit={offerCredit}
              hasSeveralPrices
            />
          )
        })
      } else {
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
          .map((stock) => (
            <HourChoice
              key={stock.id}
              price={stock.price}
              hour={formatHour(stock.beginningDatetime).replace(':', 'h')}
              selected={stock.id === bookingState.stockId}
              onPress={() => selectStock(stock.id)}
              testID={`HourChoice${stock.id}`}
              isBookable={stock.isBookable}
              offerCredit={offerCredit}
            />
          ))
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
      hasPricesStep,
    ]
  )

  const buttonTitle =
    bookingStock && bookingStock.beginningDatetime ? formatHour(bookingStock.beginningDatetime) : ''

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

      <Spacer.Column numberOfSpaces={2} />
      {bookingState.step === Step.HOUR ? (
        <HourChoiceContainer>{filteredStocks}</HourChoiceContainer>
      ) : (
        <TouchableOpacity onPress={changeHour}>
          <Typo.ButtonText>{buttonTitle}</Typo.ButtonText>
        </TouchableOpacity>
      )}
    </React.Fragment>
  )
}

const HourChoiceContainer = styled.View({
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginHorizontal: -getSpacing(2),
})
