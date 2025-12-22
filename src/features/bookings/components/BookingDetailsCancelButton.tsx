import React from 'react'
import styled from 'styled-components/native'

import { BookingResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import {
  BookingDetailsButton,
  BookingDetailsButtonProps,
} from 'features/bookings/components/BookingDetailsButton'
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
  const isDigitalBookingWithoutExpirationDate =
    booking.stock.offer.isDigital && !booking.expirationDate
  const isFreeOfferToArchive = booking.stock.isAutomaticallyUsed

  if (
    !expirationDate &&
    ((!booking.confirmationDate && booking.stock.offer.isDigital) || isFreeOfferToArchive)
  )
    return null

  const cancelMessage = getCancelMessage({
    confirmationDate: booking.confirmationDate,
    expirationDate,
    isDigitalBookingWithoutExpirationDate,
    isFreeOfferToArchive,
    user,
    displayAsEnded: !!booking.displayAsEnded,
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
