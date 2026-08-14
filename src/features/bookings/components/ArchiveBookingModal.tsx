import React from 'react'
import styled from 'styled-components/native'

import { extractApiErrorMessage } from 'api/apiHelpers'
import { useArchiveBookingMutation } from 'features/bookings/queries'
import { getTabHookConfig } from 'features/navigation/TabBar/getTabHookConfig'
import { useGoBack } from 'features/navigation/useGoBack'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { remoteIllustrationUrls } from 'shared/illustrations/remoteIllustrations'
import { AppModal } from 'ui/components/modals/AppModal'
import { RemoteIllustration } from 'ui/components/RemoteIllustration'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { showErrorSnackBar, showSuccessSnackBar } from 'ui/designSystem/Snackbar/snackBar.store'
import { Close } from 'ui/svg/icons/Close'
import { PlainArrowPrevious } from 'ui/svg/icons/PlainArrowPrevious'
import { Typo } from 'ui/theme'

export interface ArchiveBookingModalProps {
  bookingId: number
  bookingTitle: string
  visible: boolean
  onDismiss: () => void
}

export const ArchiveBookingModal = (props: ArchiveBookingModalProps) => {
  const { goBack } = useGoBack(...getTabHookConfig('Bookings'))
  const enableNewVisionUi = useFeatureFlag(RemoteStoreFeatureFlags.WIP_NEW_VISION_UI)

  const { mutate, isPending } = useArchiveBookingMutation({
    bookingId: props.bookingId,
    onSuccess: () => {
      showSuccessSnackBar(
        'La réservation a bien été archivée. Tu pourras la retrouver dans tes réservations terminées'
      )
      goBack()
      props.onDismiss()
    },
    onError: (error) => {
      showErrorSnackBar(extractApiErrorMessage(error))
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
        {enableNewVisionUi ? (
          <IllustationContainer>
            <RemoteIllustration
              url={remoteIllustrationUrls.emptyWalletSmall}
              backgroundColor="information03"
              size="s"
            />
          </IllustationContainer>
        ) : null}
        <Title>{props.bookingTitle}</Title>
        <StyledBody>Tu pourras retrouver l’offre dans tes réservations teminées</StyledBody>
        <ButtonsContainer gap={3}>
          <Button
            wording="Terminer ma réservation"
            onPress={terminateCancel}
            disabled={isPending}
            fullWidth
          />
          <Button
            wording="Retourner à ma réservation"
            onPress={props.onDismiss}
            icon={PlainArrowPrevious}
            variant="tertiary"
            color="brand"
            fullWidth
          />
        </ButtonsContainer>
      </ModalContent>
    </AppModal>
  )
}

const ModalContent = styled.View({
  width: '100%',
  alignItems: 'center',
})
const Title = styled(Typo.BodyAccent)({
  textAlign: 'center',
})
const StyledBody = styled(Typo.Body)(({ theme }) => ({
  textAlign: 'center',
  marginTop: theme.designSystem.size.spacing.s,
  marginBottom: theme.designSystem.size.spacing.xl,
}))
const ButtonsContainer = styled(ViewGap)({
  width: '100%',
})

const IllustationContainer = styled.View(({ theme }) => ({
  alignItems: 'center',
  marginBottom: theme.designSystem.size.spacing.xl,
}))
