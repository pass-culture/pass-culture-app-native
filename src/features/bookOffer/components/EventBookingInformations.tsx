import React from 'react'

import { OfferResponse, OfferStockResponse } from 'api/gen'
import { Item } from 'features/bookings/components/BookingItemWithIcon'
import { PriceLine } from 'features/bookOffer/components/PriceLine'
import { formatDuration } from 'features/offer/helpers/formatDuration/formatDuration'
import { formatToCompleteFrenchDateTime } from 'libs/parsers/formatDates'
import { Booking } from 'ui/svg/icons/Booking'
import { Calendar } from 'ui/svg/icons/Calendar'
import { OrderPrice } from 'ui/svg/icons/OrderPrice'

type Props = {
  offer: Pick<OfferResponse, 'name' | 'extraData'>
  stock: OfferStockResponse
  quantity: number
}

export const EventBookingInformations: React.FC<Props> = ({ offer, stock, quantity }) => {
  const price =
    stock.price > 0 ? (
      <PriceLine
        unitPrice={stock.price}
        label={stock.priceCategoryLabel}
        quantity={quantity}
        attributes={stock.features}
      />
    ) : (
      'Gratuit'
    )

  let message = stock.beginningDatetime
    ? formatToCompleteFrenchDateTime({
        date: new Date(stock.beginningDatetime),
        shouldDisplayWeekDay: true,
      })
    : ''

  if (offer.extraData?.durationMinutes) {
    message += ` - Durée\u00a0: ${formatDuration(offer.extraData.durationMinutes).label}`
  }

  return (
    <React.Fragment>
      <Item Icon={Booking} message={offer.name} />
      {stock.beginningDatetime ? <Item Icon={Calendar} message={message} /> : null}
      <Item Icon={OrderPrice} message={price} />
    </React.Fragment>
  )
}
