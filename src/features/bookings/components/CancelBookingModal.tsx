import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { extractApiErrorMessage } from 'api/apiHelpers'
import { BookingResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { getRefundRule } from 'features/bookings/helpers/getRefundRule'
import { useCancelBookingMutation } from 'features/bookings/queries'
import { Booking } from 'features/bookings/types'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getTabHookConfig } from 'features/navigation/TabBar/helpers'
import { analytics } from 'libs/analytics/provider'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { useGetPacificFrancToEuroRate } from 'shared/exchangeRates/useGetPacificFrancToEuroRate'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryPrimary } from 'ui/components/buttons/ButtonTertiaryPrimary'
import { AppModal } from 'ui/components/modals/AppModal'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { Close } from 'ui/svg/icons/Close'
import { PlainArrowPrevious } from 'ui/svg/icons/PlainArrowPrevious'
import { getSpacing, Typo } from 'ui/theme'

interface Props {
  visible: boolean
  dismissModal: () => void
  booking: BookingResponse | Booking
}

export const CancelBookingModal: FunctionComponent<Props> = ({
  visible,
  dismissModal,
  booking,
}) => {
  const netInfo = useNetInfoContext()
  const { user } = useAuthContext()
  const currency = useGetCurrencyToDisplay()
  const euroToPacificFrancRate = useGetPacificFrancToEuroRate()
  const refundRule = getRefundRule({
    totalAmount: booking.totalAmount,
    currency,
    euroToPacificFrancRate,
    user,
  })
  const { navigate } = useNavigation<UseNavigationType>()
  const { showSuccessSnackBar, showErrorSnackBar } = useSnackBarContext()

  function onSuccess() {
    navigate(...getTabHookConfig('Bookings'))
    showSuccessSnackBar({
      message:
        'La réservation a bien été annulée. Tu pourras la retrouver dans tes réservations terminées',
      timeout: SNACK_BAR_TIME_OUT,
    })
  }

  function onError(error: unknown) {
    dismissModal()
    navigate(...getTabHookConfig('Bookings'))
    showErrorSnackBar({ message: extractApiErrorMessage(error), timeout: SNACK_BAR_TIME_OUT })
  }

  const { mutate: cancelBooking } = useCancelBookingMutation({
    onSuccess,
    onError,
  })

  const confirmCancelBooking = () => {
    if (netInfo.isConnected) {
      analytics.logConfirmBookingCancellation(booking.stock.offer.id)
      cancelBooking(booking.id)
      dismissModal()
    } else {
      dismissModal()
      showErrorSnackBar({
        message: 'Impossible d’annuler la réservation. Connecte-toi à internet avant de réessayer.',
        timeout: SNACK_BAR_TIME_OUT,
      })
    }
  }

  return (
    <AppModal
      animationOutTiming={1}
      visible={visible}
      title="Tu es sur le point d’annuler"
      rightIconAccessibilityLabel="Ne pas annuler"
      rightIcon={Close}
      onRightIconPress={dismissModal}>
      <ModalContent>
        <OfferName>{booking.stock.offer.name}</OfferName>
        {refundRule ? <Refund>{refundRule}</Refund> : null}
        <CancelButtonContainer>
          <ButtonPrimary wording="Annuler ma réservation" onPress={confirmCancelBooking} />
        </CancelButtonContainer>
        <ButtonTertiaryPrimary
          wording="Retourner à ma réservation"
          onPress={dismissModal}
          icon={PlainArrowPrevious}
        />
      </ModalContent>
    </AppModal>
  )
}

const ModalContent = styled.View({
  paddingHorizontal: getSpacing(5.5),
  width: '100%',
  marginBottom: getSpacing(1),
})

const OfferName = styled(Typo.BodyAccent)({
  textAlign: 'center',
})

const Refund = styled(Typo.Body)({
  textAlign: 'center',
  marginTop: getSpacing(2),
})

const CancelButtonContainer = styled.View({
  marginTop: getSpacing(8),
  marginBottom: getSpacing(5),
})
