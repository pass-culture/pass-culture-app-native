/* eslint-disable react-native/no-raw-text */
import { t } from '@lingui/macro'
import React from 'react'

import { OfferStockResponse } from 'api/gen'
import { _ } from 'libs/i18n'
import { Typo } from 'ui/theme'

interface Props {
  stocks: OfferStockResponse[]
}
export const BookDateChoice: React.FC<Props> = ({ stocks }) => {
  return (
    <React.Fragment>
      <Typo.Title4>{_(t`Date`)}</Typo.Title4>
      <Typo.ButtonText>{_(t`Samedi 12 mai 2021`)}</Typo.ButtonText>
      <Typo.Body>{`Dates réservables : ${getDatesByStatus(stocks).bookableDates}`}</Typo.Body>
      <Typo.Body>{`Dates non-réservables : ${
        getDatesByStatus(stocks).notBookableDates
      }`}</Typo.Body>
    </React.Fragment>
  )
}

export const getDatesByStatus = (stocks: OfferStockResponse[]) => {
  const bookableDates: Date[] = []
  const notBookableDates: Date[] = []

  stocks.forEach((stock) => {
    const isExpired = stock.bookingLimitDatetime ? stock.bookingLimitDatetime < new Date() : false
    if (stock.beginningDatetime) {
      if (stock.isBookable && !isExpired) {
        bookableDates.push(stock.beginningDatetime)
      } else {
        notBookableDates.push(stock.beginningDatetime)
      }
    }
  })
  return { bookableDates, notBookableDates }
}
