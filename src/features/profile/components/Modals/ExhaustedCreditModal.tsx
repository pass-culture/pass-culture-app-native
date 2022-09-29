import React from 'react'

import { ExpiredOrExhaustedCreditModalContent } from 'features/profile/components/Modals/ExpiredOrExhaustedCreditModalContent'
import { AppInformationModal } from 'ui/components/modals/AppInformationModal'

type Props = {
  visible: boolean
  hideModal: () => void
}

export function ExhaustedCreditModal({ visible, hideModal }: Props) {
  return (
    <AppInformationModal
      title="Tu as dépensé tout ton crédit, que faire&nbsp;?"
      numberOfLinesTitle={3}
      visible={visible}
      onCloseIconPress={hideModal}
      testIdSuffix="exhausted-credit">
      <ExpiredOrExhaustedCreditModalContent />
    </AppInformationModal>
  )
}
