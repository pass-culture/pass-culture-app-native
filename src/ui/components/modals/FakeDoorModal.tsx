import React from 'react'
import styled from 'styled-components/native'

import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { AppInformationModal } from 'ui/components/modals/AppInformationModal'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { BicolorCircledClock } from 'ui/svg/icons/BicolorCircledClock'
import { ExternalSite } from 'ui/svg/icons/ExternalSite'
import { Spacer, Typo } from 'ui/theme'
import { LINE_BREAK } from 'ui/theme/constants'

type Props = {
  visible: boolean
  hideModal: () => void
  surveyUrl: string
}

export const FakeDoorModal = ({ visible, hideModal, surveyUrl }: Props) => {
  return (
    <AppInformationModal
      title="Encore un peu de patience…"
      visible={visible}
      onCloseIconPress={hideModal}>
      <BicolorCircledClock />
      <Spacer.Column numberOfSpaces={4} />
      <CenteredText>
        Ce contenu n’est pas encore disponible.
        {LINE_BREAK}
        {LINE_BREAK}
        Aide-nous à le mettre en place en répondant au questionnaire.
      </CenteredText>
      <Spacer.Column numberOfSpaces={8} />
      <ExternalTouchableLink
        as={ButtonPrimary}
        icon={ExternalSite}
        wording="Répondre au questionnaire"
        externalNav={{
          url: surveyUrl,
        }}
      />
    </AppInformationModal>
  )
}

const CenteredText = styled(Typo.Body)({
  textAlign: 'center',
})
