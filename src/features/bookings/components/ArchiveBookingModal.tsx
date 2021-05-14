import { t } from '@lingui/macro'
import * as React from 'react'
import styled from 'styled-components/native'

import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiary } from 'ui/components/buttons/ButtonTertiary'
import { AppModal } from 'ui/components/modals/AppModal'
import { Close } from 'ui/svg/icons/Close'
import { getSpacing, Spacer, Typo } from 'ui/theme'

interface ArchiveBookingModalProps {
  visible: boolean
  onDismiss: () => void
}

export const ArchiveBookingModal = (props: ArchiveBookingModalProps) => {
  return (
    <AppModal
      visible={props.visible}
      title={t`Tu es sur le point d'archiver`}
      rightIcon={Close}
      onRightIconPress={props.onDismiss}>
      <ModalContent>
        <Title>{FAKE_TITLE_TO_CHANGE_IN_NEXT_COMMIT}</Title>
        <Explanation>{t`tu pourras retrouver l’offre dans tes réservations teminées`}</Explanation>
        <Spacer.Column numberOfSpaces={6} />
        <ButtonPrimary title={t`Terminer ma réservation`} />
        <Spacer.Column numberOfSpaces={3} />
        <ButtonTertiary
          title={t`Retourner à ma réservation`}
          onPress={props.onDismiss}
          testIdSuffix="back-to-booking"
        />
      </ModalContent>
    </AppModal>
  )
}

const FAKE_TITLE_TO_CHANGE_IN_NEXT_COMMIT =
  'A Temporay title: Harry Potter - Tome 5 : Harry Potter et l’Ordre du Phoenix'

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
