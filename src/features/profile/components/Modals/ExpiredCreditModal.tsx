import React, { useEffect } from 'react'

import { ExpiredOrExhaustedCreditModalContent } from 'features/profile/components/Modals/ExpiredOrExhaustedCreditModalContent'
import { analytics } from 'libs/firebase/analytics'
import { AppInformationModal } from 'ui/components/modals/AppInformationModal'

type Props = {
  visible: boolean
  hideModal: () => void
}

export function ExpiredCreditModal({ visible, hideModal }: Props) {
  useEffect(() => {
    analytics.logConsultModalExpiredGrant()
  }, [])

  return (
    <AppInformationModal
      title="Mon crédit est expiré, que faire&nbsp;?"
      numberOfLinesTitle={2}
      visible={visible}
      onCloseIconPress={hideModal}
      testIdSuffix="expired-credit">
      <ExpiredOrExhaustedCreditModalContent />
    </AppInformationModal>
  )
}
