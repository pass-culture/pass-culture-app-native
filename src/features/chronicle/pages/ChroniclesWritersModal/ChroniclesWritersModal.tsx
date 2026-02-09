import React, { FunctionComponent } from 'react'

import { ChronicleVariantInfo } from 'features/offer/components/OfferContent/ChronicleSection/types'
import { AppModal } from 'ui/components/modals/AppModal'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { Close } from 'ui/svg/icons/Close'
import { Typo } from 'ui/theme'

type Props = {
  isVisible: boolean
  closeModal: VoidFunction
  onShowRecoButtonPress: VoidFunction
  variantInfo: ChronicleVariantInfo
}

export const ChroniclesWritersModal: FunctionComponent<Props> = ({
  isVisible,
  closeModal,
  onShowRecoButtonPress,
  variantInfo,
}) => {
  return (
    <AppModal
      animationOutTiming={1}
      visible={isVisible}
      title={variantInfo.modalTitle}
      rightIconAccessibilityLabel="Fermer la modale"
      rightIcon={Close}
      onRightIconPress={closeModal}>
      <ViewGap gap={6}>
        <Typo.Body>{variantInfo.modalWording}</Typo.Body>

        <Button
          wording={variantInfo.modalButtonLabel}
          onPress={onShowRecoButtonPress}
          color="brand"
        />
      </ViewGap>
    </AppModal>
  )
}
