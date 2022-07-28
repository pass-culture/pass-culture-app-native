import { t } from '@lingui/macro'
import React from 'react'
import { Platform } from 'react-native'

import { shareAppContent } from 'libs/share/shareApp/shareAppContent'
import { WebShareModal } from 'libs/share/WebShareModal'

interface ShareAppModalProps {
  visible: boolean
  dismissModal: () => void
}

const isWeb = Platform.OS === 'web'

export const ShareAppModal = ({ visible, dismissModal }: ShareAppModalProps) => {
  const headerTitle = isWeb ? t`Partager le lien d’invitation` : t`Profite du pass Culture`
  return (
    <WebShareModal
      visible={visible}
      headerTitle={headerTitle}
      shareContent={shareAppContent}
      dismissModal={dismissModal}
    />
  )
}
