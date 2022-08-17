import { t } from '@lingui/macro'
import React, { useState } from 'react'

import { CloseButton } from 'features/cookies/atoms/CloseButton'
import { CookieConsentModal } from 'features/cookies/components/CookieConsentModal'
import { CookiesSettings } from 'features/cookies/components/CookiesSettings'
import { HomeButtons } from 'features/cookies/components/HomeButtons'
import { HomeContent } from 'features/cookies/components/HomeContent'

interface CookiesConsentModalProps {
  visible: boolean
  hideModal: () => void
}

export const CookiesConsentModal = ({ visible, hideModal }: CookiesConsentModalProps) => {
  const [showSettings, setShowSettings] = useState(false)
  return (
    <CookieConsentModal
      visible={visible}
      title={t`Avec ou sans cookies\u00a0?`}
      onClosePress={hideModal}
      headerRigthButton={<CloseButton onPress={hideModal} />}
      fixedBottomChildren={
        <HomeButtons
          onPressAcceptAll={hideModal}
          onPressDeclineAll={() => {
            setShowSettings(false)
            hideModal()
          }}
          onPressChooseCookies={() => setShowSettings(true)}
        />
      }>
      {showSettings ? <CookiesSettings /> : <HomeContent />}
    </CookieConsentModal>
  )
}
