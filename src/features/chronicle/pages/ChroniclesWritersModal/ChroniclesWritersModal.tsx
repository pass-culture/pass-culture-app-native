import React, { FunctionComponent } from 'react'

import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { AppModal } from 'ui/components/modals/AppModal'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Close } from 'ui/svg/icons/Close'
import { TypoDS } from 'ui/theme'

type Props = {
  isVisible: boolean
  closeModal: VoidFunction
  onShowRecoButtonPress: VoidFunction
}

export const ChroniclesWritersModal: FunctionComponent<Props> = ({
  isVisible,
  closeModal,
  onShowRecoButtonPress,
}) => {
  return (
    <AppModal
      animationOutTiming={1}
      visible={isVisible}
      title="Qui écrit les avis&nbsp;?"
      rightIconAccessibilityLabel="Fermer la modale"
      rightIcon={Close}
      onRightIconPress={closeModal}>
      <ViewGap gap={6}>
        <TypoDS.Body>
          Les avis du book club sont écrits par des jeunes passionnés de lecture.
        </TypoDS.Body>
        <TypoDS.Body>
          Ils sont sélectionnés par le pass Culture pour te faire leurs meilleures recos tous les
          mois.
        </TypoDS.Body>

        <ButtonPrimary
          wording="Voir toutes les recos du book club"
          onPress={onShowRecoButtonPress}
        />
      </ViewGap>
    </AppModal>
  )
}
