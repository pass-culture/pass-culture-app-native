import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { extractApiErrorMessage } from 'api/apiHelpers'
import { UserProfileResponse } from 'api/gen'
import { useCancelBookingMutation } from 'features/bookings/api'
import { Booking } from 'features/bookings/components/types'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useUserProfileInfo } from 'features/profile/api'
import { isUserBeneficiary, isUserExBeneficiary } from 'features/profile/utils'
import { analytics } from 'libs/firebase/analytics'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { formatToFrenchDecimal } from 'libs/parsers'
import { convertCentsToEuros } from 'libs/parsers/pricesConversion'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryPrimary } from 'ui/components/buttons/ButtonTertiaryPrimary'
import { AppModal } from 'ui/components/modals/AppModal'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
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
  const netInfo = useNetInfoContext()
  const { data: user } = useUserProfileInfo()
  const refundRule = getRefundRule(booking, user)
  const { navigate } = useNavigation<UseNavigationType>()
  const { showSuccessSnackBar, showErrorSnackBar } = useSnackBarContext()

  function onSuccess() {
    navigate(...getTabNavConfig('Bookings'))
    showSuccessSnackBar({
      message:
        'La réservation a bien été annulée. Tu pourras la retrouver dans tes réservations terminées',
      timeout: SNACK_BAR_TIME_OUT,
    })
  }

  function onError(error: unknown) {
    navigate(...getTabNavConfig('Bookings'))
    showErrorSnackBar({ message: extractApiErrorMessage(error), timeout: SNACK_BAR_TIME_OUT })
  }

  const { mutate } = useCancelBookingMutation({
    onSuccess,
    onError,
  })

  const confirmCancelBooking = () => {
    if (netInfo.isConnected) {
      analytics.logConfirmBookingCancellation(booking.stock.offer.id)
      mutate(booking.id)
    } else {
      dismissModal()
      showErrorSnackBar({
        message: "Impossible d'annuler la réservation. Connecte-toi à internet avant de réessayer.",
        timeout: SNACK_BAR_TIME_OUT,
      })
    }
  }

  return (
    <AppModal
      animationOutTiming={1}
      visible={visible}
      title="Tu es sur le point d'annuler"
      rightIconAccessibilityLabel="Ne pas annuler"
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
        <ButtonPrimary wording="Annuler ma réservation" onPress={confirmCancelBooking} />
        <Spacer.Column numberOfSpaces={5} />
        <ButtonTertiaryPrimary wording={'Retourner à ma réservation'} onPress={dismissModal} />
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

function getRefundRule(booking: Booking, user?: UserProfileResponse) {
  const price = convertCentsToEuros(booking.totalAmount)
  if (price > 0 && user) {
    const price = formatToFrenchDecimal(booking.totalAmount)
    if (isUserExBeneficiary(user)) {
      return `Les ${price} ne seront pas recrédités sur ton pass Culture car il est expiré.`
    }
    if (isUserBeneficiary(user)) {
      return `${price} seront recrédités sur ton pass Culture.`
    }
  }
  return null
}
