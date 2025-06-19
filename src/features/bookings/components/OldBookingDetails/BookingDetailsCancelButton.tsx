import React from 'react'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import {
  BookingDetailsButton,
  BookingDetailsButtonProps,
} from 'features/bookings/components/BookingDetailsButton'
import { FREE_OFFER_CATEGORIES_TO_ARCHIVE } from 'features/bookings/constants'
import { getBookingProperties } from 'features/bookings/helpers'
import { formattedExpirationDate } from 'features/bookings/helpers/expirationDateUtils'
import { getCancelMessage } from 'features/bookings/helpers/getCancelMessage'
import { Booking } from 'features/bookings/types'
import { useSubcategory } from 'libs/subcategories'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Typo, getSpacing } from 'ui/theme'

export type BookingDetailsCancelButtonProps = BookingDetailsButtonProps & {
  booking: Booking
}

export const BookingDetailsCancelButton = (props: BookingDetailsCancelButtonProps) => {
  const { booking } = props
  const { isEvent } = useSubcategory(booking.stock.offer.subcategoryId)
  const { hasActivationCode } = getBookingProperties(booking, isEvent)
  const { user } = useAuthContext()

  const expirationDate = formattedExpirationDate(booking.dateCreated)
  const isDigitalBooking = booking.stock.offer.isDigital === true && !booking.expirationDate
  const isFreeOfferToArchive =
    FREE_OFFER_CATEGORIES_TO_ARCHIVE.includes(booking.stock.offer.subcategoryId) &&
    booking.totalAmount === 0

  if (!expirationDate && ((!booking.confirmationDate && isDigitalBooking) || isFreeOfferToArchive))
    return null

  const cancelMessage = getCancelMessage({
    confirmationDate: booking.confirmationDate,
    expirationDate,
    isDigitalBooking,
    isFreeOfferToArchive,
    user,
  })

  const shouldDisplayButton =
    isFreeOfferToArchive ||
    !booking.confirmationDate ||
    new Date(booking.confirmationDate) > new Date()

  return (
    <StyledViewGap gap={4} testID="cancel-or-archive-section">
      {shouldDisplayButton ? (
        <BookingDetailsButton
          testID="cancel-or-archive-button"
          isFreeOfferToArchive={isFreeOfferToArchive}
          hasActivationCode={hasActivationCode}
          onTerminate={props.onTerminate}
          fullWidth={props.fullWidth}
          onCancel={props.onCancel}
        />
      ) : null}
      {cancelMessage ? (
        <StyledCaption testID="cancel-or-archive-message">{cancelMessage}</StyledCaption>
      ) : null}
    </StyledViewGap>
  )
}

const StyledCaption = styled(Typo.BodyAccentXs)(({ theme }) => ({
  textAlign: 'center',
  color: theme.designSystem.color.text.subtle,
}))

const StyledViewGap = styled(ViewGap)({
  marginBottom: getSpacing(10),
})
