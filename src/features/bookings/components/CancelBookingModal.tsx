import { t } from '@lingui/macro'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { UserProfileResponse } from 'api/gen'
import { Booking } from 'features/bookings/components/types'
import { useUserProfileInfo } from 'features/home/api'
import { Credit, useAvailableCredit } from 'features/home/services/useAvailableCredit'
import { isUserBeneficiary, isUserExBeneficiary } from 'features/profile/utils'
import { analytics } from 'libs/analytics'
import { convertCentsToEuros } from 'libs/parsers/pricesConversion'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { AppModal } from 'ui/components/modals/AppModal'
import { Close } from 'ui/svg/icons/Close'
import { getSpacing, Spacer, Typo } from 'ui/theme'

interface Props {
  visible: boolean
  dismissModal: () => void
  booking: Booking
}

export const CancelBookingModal: FunctionComponent<Props> = ({
  visible,
  dismissModal,
  booking,
}) => {
  const { data: user } = useUserProfileInfo()
  const credit = useAvailableCredit()
  const refundRule = getRefundRule(booking, user, credit)

  const confirmCancelBooking = () => {
    analytics.logConfirmBookingCancellation(booking.stock.offer.id)
  }

  return (
    <AppModal
      visible={visible}
      title={t`Tu es sur le point d'annuler`}
      rightIcon={Close}
      onRightIconPress={dismissModal}>
      <ModalContent>
        <OfferName>{booking.stock.offer.name}</OfferName>
        {refundRule && (
          <React.Fragment>
            <Spacer.Column numberOfSpaces={2} />
            <Refund>{refundRule}</Refund>
          </React.Fragment>
        )}
        <Spacer.Column numberOfSpaces={8} />
        <ButtonPrimary title={t`Annuler ma réservation`} onPress={confirmCancelBooking} />
        <Spacer.Column numberOfSpaces={5} />
        <ButtonPrimaryWhite title={t`Retourner à ma réservation`} onPress={dismissModal} />
        <Spacer.Column numberOfSpaces={1} />
      </ModalContent>
    </AppModal>
  )
}

const ModalContent = styled.View({
  paddingHorizontal: getSpacing(5.5),
  width: '100%',
})

const OfferName = styled(Typo.ButtonText)({
  textAlign: 'center',
})

const Refund = styled(Typo.Body)({
  textAlign: 'center',
})

function getRefundRule(booking: Booking, user?: UserProfileResponse, credit?: Credit) {
  const price = convertCentsToEuros(booking.totalAmount)
  if (price > 0 && user && credit) {
    if (isUserExBeneficiary(user, credit))
      return t`Les ${price} € ne seront pas recrédités sur ton pass Culture car il est expiré.`
    if (isUserBeneficiary(user))
      return price + '\u00a0' + t`€ seront recrédités sur ton pass Culture.`
  }
  return null
}
