import { t } from '@lingui/macro'
import React, { useState } from 'react'

import { CookieConsentModal } from 'features/cookies/components/CookieConsentModal'
import { CookiesSettings } from 'features/cookies/components/CookiesSettings'
import { HomeButtons } from 'features/cookies/components/HomeButtons'
import { HomeContent } from 'features/cookies/components/HomeContent'
import { Close } from 'ui/svg/icons/Close'

interface CookiesConsentModalProps {
  visible: boolean
  hideModal: () => void
}

export const CookiesConsentModal = ({ visible, hideModal }: CookiesConsentModalProps) => {
  const [showSettings, setShowSettings] = useState(false)
  const onPressAcceptAll = () => 'Accept all cookies !'
  const onPressDeclineAll = () => 'Decline all cookies !'
  const onPressChooseCookies = () => setShowSettings(true)
  const onClose = () => {
    setShowSettings(false)
    onPressDeclineAll()
    hideModal()
  }

  return (
    <CookieConsentModal
      visible={visible}
      title={t`Avec ou sans cookies\u00a0?`}
      leftIconAccessibilityLabel={undefined}
      leftIcon={undefined}
      onLeftIconPress={undefined}
      rightIconAccessibilityLabel={t`Fermer la modale et refuser les cookies`}
      rightIcon={Close}
      onRightIconPress={onClose}
      fixedBottomChildren={
        !showSettings ? (
          <HomeButtons
            onPressAcceptAll={onPressAcceptAll}
            onPressDeclineAll={onPressDeclineAll}
            onPressChooseCookies={onPressChooseCookies}
          />
        ) : null
      }>
      {showSettings ? <CookiesSettings /> : <HomeContent />}
    </CookieConsentModal>
  )
}
