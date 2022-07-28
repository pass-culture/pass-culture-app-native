import { t } from '@lingui/macro'
import React from 'react'

import { shareAppContent } from 'libs/share/shareApp/shareAppContent'
import { WebShareModal } from 'libs/share/WebShareModal'

interface ShareAppModalProps {
  visible: boolean
  dismissModal: () => void
}

export const ShareAppModal = ({ visible, dismissModal }: ShareAppModalProps) => {
  return (
    <WebShareModal
      visible={visible}
      headerTitle={t`Partager le lien d’invitation`}
      shareContent={shareAppContent}
      dismissModal={dismissModal}
    />
  )
}
