import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { AppModalWithIllustration } from 'ui/components/modals/AppModalWithIllustration'
import { BicolorShout } from 'ui/svg/icons/BicolorShout'
import { Spacer, Typo } from 'ui/theme'

type Props = {
  visible: boolean
  hideModal: () => void
}

export const ShareAppModalNew: FunctionComponent<Props> = ({ visible, hideModal }) => {
  const openShareAppModal = async () => {
    hideModal()
  }
  return (
    <AppModalWithIllustration
      visible={visible}
      title="Passe la culture à ton voisin"
      Illustration={BicolorShout}
      hideModal={hideModal}>
      <StyledBody>
        Pour les 15-18 ans, le pass Culture offre un crédit dédié à la culture.
      </StyledBody>
      <Spacer.Column numberOfSpaces={6} />
      <StyledBody>Fais-en profiter ton entourage&nbsp;!</StyledBody>
      <Spacer.Column numberOfSpaces={6} />
      <ButtonPrimary
        wording="Partager"
        accessibilityLabel="Partager l'application"
        onPress={openShareAppModal}
      />
    </AppModalWithIllustration>
  )
}

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
