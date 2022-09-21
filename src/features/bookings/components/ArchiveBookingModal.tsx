import { t } from '@lingui/macro'
import * as React from 'react'
import styled from 'styled-components/native'

import { extractApiErrorMessage } from 'api/apiHelpers'
import { useArchiveBookingMutation } from 'features/bookings/api'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryPrimary } from 'ui/components/buttons/ButtonTertiaryPrimary'
import { AppModal } from 'ui/components/modals/AppModal'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { Close } from 'ui/svg/icons/Close'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export interface ArchiveBookingModalProps {
  bookingId: number
  bookingTitle: string
  visible: boolean
  onDismiss: () => void
}

export const ArchiveBookingModal = (props: ArchiveBookingModalProps) => {
  const { goBack } = useGoBack(...getTabNavConfig('Bookings'))
  const { showErrorSnackBar, showSuccessSnackBar } = useSnackBarContext()

  const { mutate, isLoading } = useArchiveBookingMutation({
    bookingId: props.bookingId,
    onSuccess: () => {
      showSuccessSnackBar({
        message: t`La réservation a bien été archivée. Tu pourras la retrouver dans tes réservations terminées`,
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
      title={t`Tu es sur le point d'archiver`}
      rightIconAccessibilityLabel={t`Ne pas archiver`}
      rightIcon={Close}
      onRightIconPress={props.onDismiss}>
      <ModalContent>
        <Title>{props.bookingTitle}</Title>
        <Explanation>{t`Tu pourras retrouver l’offre dans tes réservations teminées`}</Explanation>
        <Spacer.Column numberOfSpaces={6} />
        <ButtonPrimary
          wording={t`Terminer ma réservation`}
          onPress={terminateCancel}
          disabled={isLoading}
        />
        <Spacer.Column numberOfSpaces={3} />
        <ButtonTertiaryPrimary wording={t`Retourner à ma réservation`} onPress={props.onDismiss} />
      </ModalContent>
    </AppModal>
  )
}

const ModalContent = styled.View({
  paddingHorizontal: getSpacing(5.5),
  width: '100%',
  alignItems: 'center',
})
const Title = styled(Typo.ButtonText)({
  textAlign: 'center',
})
const Explanation = styled(Typo.Body)({
  textAlign: 'center',
  marginTop: getSpacing(2),
})
