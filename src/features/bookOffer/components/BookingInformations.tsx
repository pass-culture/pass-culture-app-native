import React from 'react'

import { Item } from 'features/bookings/components/BookingItemWithIcon'
import { PriceLine } from 'features/bookOffer/components/PriceLine'
import { useBookingContext } from 'features/bookOffer/context/useBookingContext'
import { useBookingOffer } from 'features/bookOffer/helpers/useBookingOffer'
import { useBookingStock } from 'features/bookOffer/helpers/useBookingStock'
import { formatDuration } from 'features/offerv2/helpers/formatDuration/formatDuration'
import { formatDateTimezone, formatToFrenchDate } from 'libs/parsers/formatDates'
import { useSubcategoriesMapping } from 'libs/subcategories'
import { Booking } from 'ui/svg/icons/Booking'
import { Calendar } from 'ui/svg/icons/Calendar'
import { OrderPrice } from 'ui/svg/icons/OrderPrice'

const ExpirationDate: React.FC<{
  expirationDate: string | undefined | null
}> = ({ expirationDate }) => {
  if (!expirationDate) return null

  const activationText = `À activer avant le ${formatToFrenchDate(expirationDate)}`

  return <Item Icon={Calendar} message={activationText} />
}

export const BookingInformations = () => {
  const { bookingState } = useBookingContext()
  const offer = useBookingOffer()
  const stock = useBookingStock()
  const mapping = useSubcategoriesMapping()
  const { quantity } = bookingState

  if (!stock || typeof quantity !== 'number' || !offer) return null

  const { isDigital, name } = offer

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

  if (mapping[offer.subcategoryId].isEvent) {
    const shouldDisplayWeekday = true
    let message = ''

    if (stock.beginningDatetime) {
      message = formatDateTimezone(
        stock.beginningDatetime,
        shouldDisplayWeekday,
        offer.venue.timezone
      )
    }

    if (offer.extraData?.durationMinutes) {
      message += ` - Durée\u00a0: ${formatDuration(offer.extraData.durationMinutes)}`
    }

    return (
      <React.Fragment>
        <Item Icon={Booking} message={name} />
        {!!stock.beginningDatetime && <Item Icon={Calendar} message={message} />}
        <Item Icon={OrderPrice} message={price} />
      </React.Fragment>
    )
  }

  if (!isDigital) {
    return (
      <React.Fragment>
        <Item Icon={Booking} message={name} />
        <Item Icon={OrderPrice} message={price} />
      </React.Fragment>
    )
  }

  const expirationDate = stock?.activationCode?.expirationDate

  return (
    <React.Fragment>
      <Item Icon={Booking} message={name} />
      <Item Icon={OrderPrice} message={price} />
      <ExpirationDate expirationDate={expirationDate} />
    </React.Fragment>
  )
}
