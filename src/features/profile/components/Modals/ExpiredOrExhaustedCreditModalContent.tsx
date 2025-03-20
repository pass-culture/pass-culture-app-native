import React from 'react'
import styled from 'styled-components/native'

import { Typo } from 'ui/theme'
import { DOUBLE_LINE_BREAK as LINE_BREAK } from 'ui/theme/constants'

export function ExpiredOrExhaustedCreditModalContent() {
  return (
    <ModalChildrenContainer>
      <Typo.Body>
        {`Pas de panique, l’aventure continue\u00a0!`}
        {LINE_BREAK}
        {`Tu peux toujours bénéficier des offres gratuites et exclusives sur le pass Culture.`}
      </Typo.Body>
    </ModalChildrenContainer>
  )
}

const ModalChildrenContainer = styled.View({
  alignItems: 'center',
})
