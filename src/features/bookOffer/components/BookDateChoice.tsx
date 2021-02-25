import { t } from '@lingui/macro'
import React from 'react'

import { OfferStockResponse } from 'api/gen'
import { formatToSlashedFrenchDate } from 'libs/dates'
import { _ } from 'libs/i18n'
import { Spacer, Typo } from 'ui/theme'

import { Calendar } from './Calendar/Calendar'

interface Props {
  stocks: OfferStockResponse[]
}
export const BookDateChoice: React.FC<Props> = ({ stocks }) => {
  return (
    <React.Fragment>
      <Spacer.Column numberOfSpaces={4} />
      <Typo.Title4>{_(t`Date`)}</Typo.Title4>
      <Calendar stocks={stocks} />
    </React.Fragment>
  )
}

export const getStocksByDate = (
  stocks: OfferStockResponse[]
): { [date: string]: OfferStockResponse[] } => {
  const stockDates: { [date: string]: OfferStockResponse[] } = {}

  stocks.forEach((stock) => {
    if (stock.beginningDatetime !== null && stock.beginningDatetime !== undefined) {
      const formattedDate = formatToSlashedFrenchDate(stock.beginningDatetime.toString())
      stockDates[formattedDate] = stockDates[formattedDate]
        ? stockDates[formattedDate].concat(stock)
        : [stock]
    }
  })

  return stockDates
}

export enum OfferStatus {
  BOOKABLE = 'BOOKABLE',
  NOT_BOOKABLE = 'NOTBOOKABLE',
  NOT_OFFERED = 'NOTOFFERED',
}

export const getDateStatusAndPrice = (
  date: Date,
  stocksDates: { [date: string]: OfferStockResponse[] }
): { status: OfferStatus } => {
  const stocksByDate = stocksDates[formatToSlashedFrenchDate(date.toString())]
  if (!stocksByDate) return { status: OfferStatus.NOT_OFFERED }
  const offerIsBookable = stocksByDate.some((stock) => stock.isBookable)
  if (offerIsBookable) return { status: OfferStatus.BOOKABLE }
  return { status: OfferStatus.NOT_BOOKABLE }
}
