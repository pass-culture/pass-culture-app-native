import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { extractApiErrorMessage } from 'api/apiHelpers'
import { UserProfileResponse } from 'api/gen'
import { Booking } from 'features/bookings/components/types'
import { useUserProfileInfo } from 'features/home/api'
import { Credit, useAvailableCredit } from 'features/home/services/useAvailableCredit'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { getTabNavigateConfig } from 'features/navigation/TabBar/helpers'
import { isUserBeneficiary, isUserExBeneficiary } from 'features/profile/utils'
import { analytics } from 'libs/analytics'
import { formatToFrenchDecimal } from 'libs/parsers'
import { convertCentsToEuros } from 'libs/parsers/pricesConversion'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { AppModal } from 'ui/components/modals/AppModal'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { Close } from 'ui/svg/icons/Close'
import { getSpacing, Spacer, Typo } from 'ui/theme'

import { useCancelBookingMutation } from '../services/useCancelBookingMutation'

interface Props {
  visible: boolean
  dismissModal: () => void
  booking: Booking
}

const bookingsTabNavigateConfig = getTabNavigateConfig('Bookings')

export const CancelBookingModal: FunctionComponent<Props> = ({
  visible,
  dismissModal,
  booking,
}) => {
  const { data: user } = useUserProfileInfo()
  const credit = useAvailableCredit()
  const refundRule = getRefundRule(booking, user, credit)
  const { navigate } = useNavigation<UseNavigationType>()
  const { showSuccessSnackBar, showErrorSnackBar } = useSnackBarContext()

  function onSuccess() {
    navigate(bookingsTabNavigateConfig.screen, bookingsTabNavigateConfig.params)
    showSuccessSnackBar({
      message: t`La réservation a bien été annulée. Tu pourras la retrouver dans tes réservations terminées`,
      timeout: SNACK_BAR_TIME_OUT,
    })
  }

  function onError(error: unknown) {
    navigate(bookingsTabNavigateConfig.screen, bookingsTabNavigateConfig.params)
    showErrorSnackBar({ message: extractApiErrorMessage(error), timeout: SNACK_BAR_TIME_OUT })
  }

  const { mutate } = useCancelBookingMutation({
    onSuccess,
    onError,
  })

  const confirmCancelBooking = () => {
    analytics.logConfirmBookingCancellation(booking.stock.offer.id)
    mutate(booking.id)
  }

  return (
    <AppModal
      visible={visible}
      title={t`Tu es sur le point d'annuler`}
      leftIconAccessibilityLabel={undefined}
      leftIcon={undefined}
      onLeftIconPress={undefined}
      rightIconAccessibilityLabel={t`Ne pas annuler`}
      rightIcon={Close}
      onRightIconPress={dismissModal}>
      <ModalContent>
        <OfferName>{booking.stock.offer.name}</OfferName>
        {!!refundRule && (
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
    if (isUserExBeneficiary(user, credit)) {
      return t({
        id: 'not refunded because expired',
        values: { price: formatToFrenchDecimal(booking.totalAmount) },
        message: 'Les {price} ne seront pas recrédités sur ton pass Culture car il est expiré.',
      })
    }
    if (isUserBeneficiary(user)) {
      return t({
        id: 'refunded on your pass',
        values: { price: formatToFrenchDecimal(booking.totalAmount) },
        message: '{price} seront recrédités sur ton pass Culture.',
      })
    }
  }
  return null
}
