import { t } from '@lingui/macro'
import React from 'react'

import { CookiesSettings } from 'features/cookies/components/CookiesSettings'
import { AppModal } from 'ui/components/modals/AppModal'
import { Close } from 'ui/svg/icons/Close'

interface CookiesConsentModalProps {
  visible: boolean
  hideModal: () => void
}

export const CookiesConsentModal = ({ visible, hideModal }: CookiesConsentModalProps) => {
  return (
    <AppModal
      visible={visible}
      title={t`Respect de ta vie privée`}
      leftIconAccessibilityLabel={undefined}
      leftIcon={undefined}
      onLeftIconPress={undefined}
      rightIconAccessibilityLabel={t`Fermer la modale et refuser les cookies`}
      rightIcon={Close}
      onRightIconPress={hideModal}>
      <CookiesSettings />
    </AppModal>
  )
}
