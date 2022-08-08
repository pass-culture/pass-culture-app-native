import { t } from '@lingui/macro'
import React from 'react'

import { ExpiredOrExhaustedCreditModalContent } from 'features/profile/components/Modals/ExpiredOrExhaustedCreditModalContent'
import { AppInformationModal } from 'ui/components/modals/AppInformationModal'

type Props = {
  visible: boolean
  hideModal: () => void
}

export function ExpiredCreditModal({ visible, hideModal }: Props) {
  return (
    <AppInformationModal
      title={t`Mon crédit est expiré, que faire\u00a0?`}
      numberOfLinesTitle={2}
      visible={visible}
      onCloseIconPress={hideModal}
      testIdSuffix="expired-credit">
      <ExpiredOrExhaustedCreditModalContent />
    </AppInformationModal>
  )
}
