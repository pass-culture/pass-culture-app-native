import React from 'react'
import styled from 'styled-components/native'

import { BookingResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import {
  BookingDetailsButton,
  BookingDetailsButtonProps,
} from 'features/bookings/components/BookingDetailsButton'
import { FREE_OFFER_CATEGORIES_TO_ARCHIVE } from 'features/bookings/constants'
import { getBookingPropertiesV2 } from 'features/bookings/helpers'
import { formattedExpirationDate } from 'features/bookings/helpers/expirationDateUtils'
import { getCancelMessage } from 'features/bookings/helpers/getCancelMessage'
import { useSubcategory } from 'libs/subcategories'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Typo } from 'ui/theme'

export type BookingDetailsCancelButtonProps = BookingDetailsButtonProps & {
  booking: BookingResponse
}

export const BookingDetailsCancelButton = (props: BookingDetailsCancelButtonProps) => {
  const { booking } = props
  const { isEvent } = useSubcategory(booking.stock.offer.subcategoryId)
  const { hasActivationCode } = getBookingPropertiesV2.getBookingProperties(booking, isEvent)
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
    <ViewGap gap={4} testID="cancel-or-archive-section">
      {cancelMessage ? (
        <StyledCaption testID="cancel-or-archive-message">{cancelMessage}</StyledCaption>
      ) : null}
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
    </ViewGap>
  )
}

const StyledCaption = styled(Typo.BodyAccentXs)(({ theme }) => ({
  textAlign: 'center',
  color: theme.designSystem.color.text.subtle,
}))
