import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { AppModal } from 'ui/components/modals/AppModal'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Close } from 'ui/svg/icons/Close'
import { Typo } from 'ui/theme'

type Props = {
  visible: boolean
  handleCloseModal: () => void
}

export const IncentiveLocationModal: FunctionComponent<Props> = ({ visible, handleCloseModal }) => {
  return (
    <AppModal
      title="Où te trouves-tu&nbsp;?"
      visible={visible}
      rightIcon={Close}
      onRightIconPress={handleCloseModal}
      rightIconAccessibilityLabel="Fermer la modale">
      <ViewGap gap={6}>
        <StyledBody>
          Renseigne une localisation pour trouver les meilleurs lieux culturels depuis la carte pass
          Culture
        </StyledBody>
        <ButtonPrimary wording="Activer ma localisation" />
      </ViewGap>
    </AppModal>
  )
}

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
