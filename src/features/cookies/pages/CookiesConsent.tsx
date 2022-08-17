import { t } from '@lingui/macro'
import React, { useState } from 'react'

import { CookiesConsentButtons } from 'features/cookies/components/CookiesConsentButtons'
import { CookiesConsentExplanations } from 'features/cookies/components/CookiesConsentExplanations'
import { CookiesConsentModal } from 'features/cookies/components/CookiesConsentModal'
import { CookiesSettings } from 'features/cookies/components/CookiesSettings'

interface Props {
  visible: boolean
  hideModal: () => void
}

export const CookiesConsent = ({ visible, hideModal }: Props) => {
  const [showSettings, showSetSettings] = useState(false)

  return (
    <CookiesConsentModal
      visible={visible}
      title={t`Avec ou sans cookies\u00a0?`}
      leftIconAccessibilityLabel={undefined}
      leftIcon={undefined}
      onLeftIconPress={undefined}
      rightIconAccessibilityLabel={undefined}
      rightIcon={undefined}
      onRightIconPress={undefined}
      fixedBottomChildren={
        showSettings ? null : (
          <CookiesConsentButtons
            onPressAcceptAll={hideModal}
            onPressDeclineAll={hideModal}
            onPressChooseCookies={() => showSetSettings(true)}
          />
        )
      }>
      {showSettings ? <CookiesSettings /> : <CookiesConsentExplanations />}
    </CookiesConsentModal>
  )
}
