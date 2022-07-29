import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { AppInformationModal } from 'ui/components/modals/AppInformationModal'
import { getSpacing, Spacer, Typo } from 'ui/theme'

type Props = {
  visible: boolean
  hideModal: () => void
}

const LINE_BREAK = '\n\n'
const SPACE = ' '

export function ExpiredCreditModal({ visible, hideModal }: Props) {
  return (
    <AppInformationModal
      title={t`Mon crédit est expiré, que faire\u00a0?`}
      numberOfLinesTitle={2}
      visible={visible}
      onCloseIconPress={hideModal}
      testIdSuffix="expired-credit">
      <ModalChildrenContainer>
        <Spacer.Column numberOfSpaces={2} />
        <StyledBody>
          {t`Ton crédit pass Culture est arrivé à expiration mais l’aventure continue\u00a0!` +
            LINE_BREAK +
            t`Tu peux toujours` +
            SPACE}
          <Typo.ButtonText>{t`réserver les offres gratuites` + SPACE}</Typo.ButtonText>
          {t`ou` + SPACE}
          <Typo.ButtonText>{t`exclusives` + SPACE}</Typo.ButtonText>
          {t`sur le pass Culture.` + LINE_BREAK + t`Tu peux aussi découvrir` + SPACE}
          <Typo.ButtonText>{t`les activités culturelles` + SPACE}</Typo.ButtonText>
          {t`de nos partenaires sur l'application et` + SPACE}
          <Typo.ButtonText>{t`réserver directement sur leur site.`}</Typo.ButtonText>
        </StyledBody>
      </ModalChildrenContainer>
    </AppInformationModal>
  )
}

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})

const ModalChildrenContainer = styled.View({
  paddingTop: getSpacing(5),
  alignItems: 'center',
})
