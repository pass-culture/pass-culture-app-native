import { t } from '@lingui/macro'
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
      title={t`Tu as dépensé tout ton crédit, que faire\u00a0?`}
      numberOfLinesTitle={3}
      visible={visible}
      onCloseIconPress={hideModal}
      testIdSuffix="exhausted-credit">
      <ExpiredOrExhaustedCreditModalContent />
    </AppInformationModal>
  )
}
