import React from 'react'
import styled from 'styled-components/native'

import { extractApiErrorMessage } from 'api/apiHelpers'
import { useArchiveBookingMutation } from 'features/bookings/queries'
import { getTabHookConfig } from 'features/navigation/TabBar/getTabHookConfig'
import { useGoBack } from 'features/navigation/useGoBack'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryPrimary } from 'ui/components/buttons/ButtonTertiaryPrimary'
import { AppModal } from 'ui/components/modals/AppModal'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { Close } from 'ui/svg/icons/Close'
import { PlainArrowPrevious } from 'ui/svg/icons/PlainArrowPrevious'
import { Spacer, Typo, getSpacing } from 'ui/theme'

export interface ArchiveBookingModalProps {
  bookingId: number
  bookingTitle: string
  visible: boolean
  onDismiss: () => void
}

export const ArchiveBookingModal = (props: ArchiveBookingModalProps) => {
  const { goBack } = useGoBack(...getTabHookConfig('Bookings'))
  const { showErrorSnackBar, showSuccessSnackBar } = useSnackBarContext()

  const { mutate, isPending } = useArchiveBookingMutation({
    bookingId: props.bookingId,
    onSuccess: () => {
      showSuccessSnackBar({
        message:
          'La réservation a bien été archivée. Tu pourras la retrouver dans tes réservations terminées',
        timeout: SNACK_BAR_TIME_OUT,
      })
      goBack()
      props.onDismiss()
    },
    onError: (error) => {
      showErrorSnackBar({
        message: extractApiErrorMessage(error),
        timeout: SNACK_BAR_TIME_OUT,
      })
    },
  })

  const terminateCancel = () => mutate()

  return (
    <AppModal
      animationOutTiming={1}
      visible={props.visible}
      title="Tu es sur le point d’archiver"
      rightIconAccessibilityLabel="Ne pas archiver"
      rightIcon={Close}
      onRightIconPress={props.onDismiss}>
      <ModalContent>
        <Title>{props.bookingTitle}</Title>
        <StyledBody>Tu pourras retrouver l’offre dans tes réservations teminées</StyledBody>
        <Spacer.Column numberOfSpaces={6} />
        <ButtonPrimary
          wording="Terminer ma réservation"
          onPress={terminateCancel}
          disabled={isPending}
        />
        <Spacer.Column numberOfSpaces={3} />
        <ButtonTertiaryPrimary
          wording="Retourner à ma réservation"
          onPress={props.onDismiss}
          icon={PlainArrowPrevious}
        />
      </ModalContent>
    </AppModal>
  )
}

const ModalContent = styled.View({
  paddingHorizontal: getSpacing(5.5),
  width: '100%',
  alignItems: 'center',
})
const Title = styled(Typo.BodyAccent)({
  textAlign: 'center',
})
const StyledBody = styled(Typo.Body)(({ theme }) => ({
  textAlign: 'center',
  marginTop: theme.designSystem.size.spacing.s,
}))
