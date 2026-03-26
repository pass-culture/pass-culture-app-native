import React, { FunctionComponent } from 'react'

import { AppModal } from 'ui/components/modals/AppModal'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { Close } from 'ui/svg/icons/Close'
import { Typo } from 'ui/theme'

type Props = {
  isVisible: boolean
  closeModal: VoidFunction
  onShowRecoButtonPress: VoidFunction
  modalWording: string
  buttonWording: string
}

export const AdvicesWritersModal: FunctionComponent<Props> = ({
  isVisible,
  closeModal,
  onShowRecoButtonPress,
  modalWording,
  buttonWording,
}) => {
  return (
    <AppModal
      animationOutTiming={1}
      visible={isVisible}
      title={'Qui écrit les avis\u00a0?'}
      rightIconAccessibilityLabel="Fermer la modale"
      rightIcon={Close}
      onRightIconPress={closeModal}>
      <ViewGap gap={6}>
        <Typo.Body>{modalWording}</Typo.Body>

        <Button wording={buttonWording} onPress={onShowRecoButtonPress} color="brand" />
      </ViewGap>
    </AppModal>
  )
}
