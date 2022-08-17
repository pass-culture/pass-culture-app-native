import { t } from '@lingui/macro'
import React,  from 'react'

import { CloseButton } from 'features/cookies/atoms/CloseButton'
import { CookiesConsentModal } from 'features/cookies/components/CookiesConsentModal'
import { HomeButtons } from 'features/cookies/components/HomeButtons'
import { HomeContent } from 'features/cookies/components/HomeContent'

interface CookiesConsentModalProps {
  visible: boolean
  hideModal: () => void
}

export const CookiesConsentHome = ({ visible, hideModal }: CookiesConsentModalProps) => {
  return (
    <CookiesConsentModal
      visible={visible}
      title={t`Avec ou sans cookies\u00a0?`}
      onClosePress={hideModal}
      headerRigthButton={<CloseButton onPress={hideModal} />}
      fixedBottomChildren={
        <HomeButtons
          onPressAcceptAll={hideModal}
          onPressDeclineAll={hideModal}
          onPressChooseCookies={hideModal}
        />
      }>
      <HomeContent />
    </CookiesConsentModal>
  )
}
