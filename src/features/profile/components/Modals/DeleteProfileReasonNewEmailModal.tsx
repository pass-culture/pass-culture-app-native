import React from 'react'
import styled from 'styled-components/native'

import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { AppModal } from 'ui/components/modals/AppModal'
import { Close } from 'ui/svg/icons/Close'
import { Spacer, TypoDS } from 'ui/theme'

type Props = {
  isVisible: boolean
  hideModal: () => void
}

export const DeleteProfileReasonNewEmailModal: React.FC<Props> = ({ isVisible, hideModal }) => {
  return (
    <AppModal
      title="Modifie ton adresse e-mail sur ce compte"
      visible={isVisible}
      rightIcon={Close}
      onRightIconPress={hideModal}
      rightIconAccessibilityLabel="Fermer la modale">
      <StyledBody>Tu ne peux créer qu’un seul compte pass Culture à ton nom.</StyledBody>
      <StyledBody>
        Pour modifier ton adresse e-mail, suis les instructions sur cette page.
      </StyledBody>
      <Spacer.Column numberOfSpaces={5} />
      <ButtonPrimary wording="J’ai compris" onPress={hideModal} />
    </AppModal>
  )
}

const StyledBody = styled(TypoDS.Body)({
  textAlign: 'center',
})
