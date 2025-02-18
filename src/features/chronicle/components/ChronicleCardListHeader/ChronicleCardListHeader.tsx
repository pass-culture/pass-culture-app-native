import React, { FunctionComponent } from 'react'

import { ChroniclesWritersModal } from 'features/chronicle/pages/ChroniclesWritersModal/ChroniclesWritersModal'
import { ButtonQuaternaryBlack } from 'ui/components/buttons/ButtonQuaternaryBlack'
import { styledButton } from 'ui/components/buttons/styledButton'
import { useModal } from 'ui/components/modals/useModal'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { InfoPlain } from 'ui/svg/icons/InfoPlain'
import { TypoDS, getSpacing } from 'ui/theme'

export const ChronicleCardListHeader: FunctionComponent = () => {
  const { visible, showModal, hideModal } = useModal(false)

  return (
    <React.Fragment>
      <ViewGap gap={2}>
        <TypoDS.Title2>Tous les avis</TypoDS.Title2>
        <StyledButtonQuaternaryBlack
          wording="Qui écrit les avis&nbsp;?"
          icon={InfoPlain}
          onPress={showModal}
        />
      </ViewGap>
      <ChroniclesWritersModal closeModal={hideModal} isVisible={visible} />
    </React.Fragment>
  )
}

const StyledButtonQuaternaryBlack = styledButton(ButtonQuaternaryBlack)({
  width: getSpacing(34),
  marginBottom: getSpacing(6),
})
