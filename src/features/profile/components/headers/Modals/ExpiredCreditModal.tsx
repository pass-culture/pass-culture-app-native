import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { AppInformationModal } from 'ui/components/modals/AppInformationModal'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { DOUBLE_LINE_BREAK as LINE_BREAK } from 'ui/theme/constants'

type Props = {
  visible: boolean
  hideModal: () => void
}

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
          {t`Ton crédit pass Culture est arrivé à expiration mais l’aventure continue\u00a0!`}
          {LINE_BREAK}
          {t`Tu peux toujours réserver les offres gratuites ou exclusives sur le pass Culture.`}
          {LINE_BREAK}
          {t`Tu peux aussi découvrir les activités culturelles de nos partenaires sur l'application et réserver directement sur leur site.`}
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
