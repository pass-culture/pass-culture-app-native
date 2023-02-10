import React from 'react'
import styled from 'styled-components/native'

import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { AppInformationModal } from 'ui/components/modals/AppInformationModal'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { BicolorCircledClock } from 'ui/svg/icons/BicolorCircledClock'
import { ExternalSite } from 'ui/svg/icons/ExternalSite'
import { Typo } from 'ui/theme'
import { LINE_BREAK } from 'ui/theme/constants'

type Props = {
  visible: boolean
  hideModal: () => void
}

export const FavoriteListSurveyModal = ({ visible, hideModal }: Props) => {
  return (
    <AppInformationModal
      title="Encore un peu de patience..."
      visible={visible}
      onCloseIconPress={hideModal}>
      <BicolorCircledClock />
      <CenteredText>
        Cette fonctionnalité n’est pas encore disponible.
        {LINE_BREAK}
        Aide-nous à la mettre en place en répondant au questionnaire.
      </CenteredText>
      <ExternalTouchableLink
        as={ButtonPrimary}
        icon={ExternalSite}
        wording="Répondre au questionnaire"
        externalNav={{
          url: 'https://passculture.qualtrics.com/jfe/form/SV_0qAg2IoZijISBsG',
        }}></ExternalTouchableLink>
    </AppInformationModal>
  )
}

const CenteredText = styled(Typo.Body)({
  textAlign: 'center',
  marginBottom: 32,
})
