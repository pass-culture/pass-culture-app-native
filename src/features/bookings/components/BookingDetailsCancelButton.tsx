import * as React from 'react'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { ActivationCodeButton } from 'features/bookings/components/ActivationCodeButton'
import { BookingExpiration } from 'features/bookings/components/BookingExpiration'
import { CancelBookingButton } from 'features/bookings/components/CancelBookingButton'
import { FREE_OFFER_CATEGORIES_TO_ARCHIVE } from 'features/bookings/constants'
import { getBookingProperties } from 'features/bookings/helpers'
import { formattedExpirationDate } from 'features/bookings/helpers/expirationDateUtils'
import { Booking } from 'features/bookings/types'
import { isUserExBeneficiary } from 'features/profile/helpers/isUserExBeneficiary'
import { formatToCompleteFrenchDate } from 'libs/parsers/formatDates'
import { useSubcategory } from 'libs/subcategories'
import { Spacer, Typo } from 'ui/theme'
import { LINE_BREAK } from 'ui/theme/constants'

export interface BookingDetailsCancelButtonProps {
  booking: Booking
  onCancel?: () => void
  onTerminate?: () => void
  fullWidth?: boolean
}

export const BookingDetailsCancelButton = (props: BookingDetailsCancelButtonProps) => {
  const { booking } = props
  const { isEvent } = useSubcategory(booking.stock.offer.subcategoryId)
  const properties = getBookingProperties(booking, isEvent)
  const { user } = useAuthContext()
  const isExBeneficiary = user && isUserExBeneficiary(user)
  const remainingDays = formattedExpirationDate(booking.dateCreated)
  const isDigitalBooking = booking.stock.offer.isDigital === true && !booking.expirationDate
  const isFreeOfferToArchive =
    FREE_OFFER_CATEGORIES_TO_ARCHIVE.includes(booking.stock.offer.subcategoryId) &&
    booking.totalAmount === 0

  const renderButton = () => {
    if (properties.hasActivationCode) {
      return <ActivationCodeButton onTerminate={props.onTerminate} fullWidth={props.fullWidth} />
    }
    if (!isFreeOfferToArchive) {
      return <CancelBookingButton onCancel={props.onCancel} fullWidth={props.fullWidth} />
    }
    return null
  }

  if ((!booking.confirmationDate && isDigitalBooking) || isFreeOfferToArchive) {
    return <BookingExpiration expirationDate={remainingDays}>{renderButton()}</BookingExpiration>
  }

  const isStillCancellable =
    booking.confirmationDate && new Date(booking.confirmationDate) > new Date()

  const formattedConfirmationDate = booking.confirmationDate
    ? formatToCompleteFrenchDate(new Date(booking.confirmationDate), false)
    : ''

  const stillCancellableMessage = `La réservation est annulable jusqu’au\u00a0${formattedConfirmationDate}`
  const isExBeneficiaryMessage =
    'Ton crédit est expiré.' +
    LINE_BREAK +
    `Tu ne peux plus annuler ta réservation\u00a0: elle devait être annulée avant le ${formattedConfirmationDate}`
  const expirationDateMessage = `Tu ne peux plus annuler ta réservation. Elle expirera automatiquement le ${remainingDays}`
  const otherBookingStatusMessage = `Tu ne peux plus annuler ta réservation\u00a0: elle devait être annulée avant le\u00a0${formattedConfirmationDate}`

  let cancelAnnulationMessage = ''
  let button = null

  if (isStillCancellable) {
    cancelAnnulationMessage = stillCancellableMessage
    button = renderButton()
  } else if (booking.confirmationDate) {
    if (isExBeneficiary) {
      cancelAnnulationMessage = isExBeneficiaryMessage
    } else if (isDigitalBooking) {
      cancelAnnulationMessage = expirationDateMessage
    } else {
      cancelAnnulationMessage = otherBookingStatusMessage
    }
  } else {
    button = renderButton()
  }

  return (
    <React.Fragment>
      {button}
      {cancelAnnulationMessage ? (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={4} />
          <StyledCaption testID="cancel-annulation-message">
            {cancelAnnulationMessage}
          </StyledCaption>
        </React.Fragment>
      ) : null}
    </React.Fragment>
  )
}

const StyledCaption = styled(Typo.CaptionNeutralInfo)({
  textAlign: 'center',
})
