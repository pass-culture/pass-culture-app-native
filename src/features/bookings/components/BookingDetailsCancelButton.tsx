import { t } from '@lingui/macro'
import * as React from 'react'
import styled from 'styled-components/native'

import { getBookingProperties } from 'features/bookings/helpers'
import { useUserProfileInfo } from 'features/home/api'
import { isUserExBeneficiary } from 'features/profile/utils'
import { formatToCompleteFrenchDate } from 'libs/parsers'
import { useSubcategory } from 'libs/subcategories'
import { ButtonSecondary } from 'ui/components/buttons/ButtonSecondary'
import { ColorsEnum, Spacer, Typo } from 'ui/theme'

import { Booking } from './types'

export interface BookingDetailsCancelButtonProps {
  booking: Booking
  activationCodeFeatureEnabled?: boolean
  onCancel?: () => void
  onTerminate?: () => void
  fullWidth?: boolean
}

export const BookingDetailsCancelButton = (props: BookingDetailsCancelButtonProps) => {
  const { booking } = props
  const { isEvent } = useSubcategory(booking.stock.offer.subcategoryId)
  const properties = getBookingProperties(booking, isEvent)
  const { data: user } = useUserProfileInfo()
  const isExBeneficiary = user && isUserExBeneficiary(user)

  if (properties.hasActivationCode == true && props.activationCodeFeatureEnabled) {
    return (
      <ButtonSecondary
        title={t`Terminer`}
        onPress={props.onTerminate}
        fullWidth={props.fullWidth}
      />
    )
  }

  const renderButton = (
    <ButtonSecondary
      title={t`Annuler ma réservation`}
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
      return (
        <React.Fragment>
          {renderButton}
          <Spacer.Column numberOfSpaces={4} />
          <CancellationCaption>
            {t`La réservation est annulable jusqu'au` + '\u00a0' + formattedConfirmationDate}
          </CancellationCaption>
        </React.Fragment>
      )
    } else if (isExBeneficiary) {
      return (
        <CancellationCaption>
          {t({
            id: 'not cancellable because expired for ex beneficiary',
            values: { date: formattedConfirmationDate },
            message:
              'Ton crédit est expiré.\nTu ne peux plus annuler ta réservation\u00a0: elle devait être annulée avant le {date}',
          })}
        </CancellationCaption>
      )
    } else {
      return (
        <CancellationCaption>
          {t`Tu ne peux plus annuler ta réservation\u00a0: elle devait être annulée avant le` +
            '\u00a0' +
            formattedConfirmationDate}
        </CancellationCaption>
      )
    }
  }

  return renderButton
}

const CancellationCaption = styled(Typo.Caption)({
  textAlign: 'center',
  color: ColorsEnum.GREY_DARK,
})
