import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { Typo } from 'ui/theme'
import { DOUBLE_LINE_BREAK as LINE_BREAK } from 'ui/theme/constants'

export function ExpiredOrExhaustedCreditModalContent() {
  return (
    <ModalChildrenContainer>
      <Typo.Body>
        {t`Pas de panique, l’aventure continue\u00a0!`}
        {LINE_BREAK}
        {t`Tu peux toujours bénéficier des offres gratuites et exclusives sur le pass Culture.`}
        {LINE_BREAK}
        {t`Tu peux aussi réserver les activités culturelles de nos partenaires directement sur leur site.`}
      </Typo.Body>
    </ModalChildrenContainer>
  )
}

const ModalChildrenContainer = styled.View({
  alignItems: 'center',
})
