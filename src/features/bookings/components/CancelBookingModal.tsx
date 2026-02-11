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
import { getTabHookConfig } from 'features/navigation/TabBar/getTabHookConfig'
import { analytics } from 'libs/analytics/provider'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { usePacificFrancToEuroRate } from 'queries/settings/useSettings'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryPrimary } from 'ui/components/buttons/ButtonTertiaryPrimary'
import { AppModal } from 'ui/components/modals/AppModal'
import { showErrorSnackBar, showSuccessSnackBar } from 'ui/designSystem/Snackbar/snackBar.store'
import { Close } from 'ui/svg/icons/Close'
import { PlainArrowPrevious } from 'ui/svg/icons/PlainArrowPrevious'
import { Typo } from 'ui/theme'

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
  const { data: euroToPacificFrancRate } = usePacificFrancToEuroRate()
  const refundRule = getRefundRule({
    totalAmount: booking.totalAmount,
    currency,
    euroToPacificFrancRate,
    user,
  })
  const { navigate } = useNavigation<UseNavigationType>()

  function onSuccess() {
    navigate(...getTabHookConfig('Bookings'))
    showSuccessSnackBar(
      'La réservation a bien été annulée. Tu pourras la retrouver dans tes réservations terminées'
    )
  }

  function onError(error: unknown) {
    dismissModal()
    navigate(...getTabHookConfig('Bookings'))
    showErrorSnackBar(extractApiErrorMessage(error))
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
      showErrorSnackBar(
        'Impossible d’annuler la réservation. Connecte-toi à internet avant de réessayer.'
      )
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

const ModalContent = styled.View(({ theme }) => ({
  paddingHorizontal: theme.designSystem.size.spacing.xl,
  width: '100%',
  marginBottom: theme.designSystem.size.spacing.xs,
}))

const OfferName = styled(Typo.BodyAccent)({
  textAlign: 'center',
})

const Refund = styled(Typo.Body)(({ theme }) => ({
  textAlign: 'center',
  marginTop: theme.designSystem.size.spacing.s,
}))

const CancelButtonContainer = styled.View(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.xxl,
  marginBottom: theme.designSystem.size.spacing.xl,
}))
