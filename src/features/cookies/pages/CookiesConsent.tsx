import React, { useState } from 'react'

import { CookiesConsentModal } from 'features/cookies/components/CookiesConsentModal'
import {
  CookiesSteps,
  useCookiesModalContent,
} from 'features/cookies/components/useCookiesModalContent'

interface Props {
  visible: boolean
  hideModal: () => void
}

export const CookiesConsent = ({ visible, hideModal }: Props) => {
  const [cookiesStep, setCookiesStep] = useState(CookiesSteps.COOKIES_CONSENT)
  const { childrenProps } = useCookiesModalContent({ cookiesStep, setCookiesStep, hideModal })

  return (
    <CookiesConsentModal
      visible={visible}
      rightIconAccessibilityLabel={undefined}
      rightIcon={undefined}
      onRightIconPress={undefined}
      {...childrenProps}
    />
  )
}
