import * as React from 'react'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { getBookingProperties } from 'features/bookings/helpers'
import { Booking } from 'features/bookings/types'
import { isUserExBeneficiary } from 'features/profile/helpers/isUserExBeneficiary'
import { formatToCompleteFrenchDate } from 'libs/parsers'
import { useSubcategory } from 'libs/subcategories'
import { ButtonSecondary } from 'ui/components/buttons/ButtonSecondary'
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

  if (properties.hasActivationCode) {
    return (
      <ButtonSecondary wording="Terminer" onPress={props.onTerminate} fullWidth={props.fullWidth} />
    )
  }

  const renderButton = (
    <ButtonSecondary
      wording="Annuler ma réservation"
      onPress={props.onCancel}
      fullWidth={props.fullWidth}
    />
  )

  if (booking.confirmationDate) {
    const isStillCancellable = new Date(booking.confirmationDate) > new Date()
    const formattedConfirmationDate = formatToCompleteFrenchDate(
      new Date(booking.confirmationDate),
      false
    )
    if (isStillCancellable) {
      const stillCancellableText = `La réservation est annulable jusqu'au\u00a0${formattedConfirmationDate}`
      return (
        <React.Fragment>
          {renderButton}
          <Spacer.Column numberOfSpaces={4} />
          <StyledCaption>{stillCancellableText}</StyledCaption>
        </React.Fragment>
      )
    } else if (isExBeneficiary) {
      const isExBeneficiaryText =
        'Ton crédit est expiré.' +
        LINE_BREAK +
        `Tu ne peux plus annuler ta réservation\u00a0: elle devait être annulée avant le ${formattedConfirmationDate}`
      return <StyledCaption>{isExBeneficiaryText}</StyledCaption>
    } else {
      const otherBookingStatusTexte = `Tu ne peux plus annuler ta réservation\u00a0: elle devait être annulée avant le\u00a0${formattedConfirmationDate}`
      return <StyledCaption>{otherBookingStatusTexte}</StyledCaption>
    }
  }

  return renderButton
}

const StyledCaption = styled(Typo.CaptionNeutralInfo)({
  textAlign: 'center',
})
