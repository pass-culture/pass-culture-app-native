import React, { useState } from 'react'

import { CookiesConsentModal } from 'features/cookies/components/CookiesConsentModal'
import {
  CookiesSteps,
  useCookiesModalContent,
} from 'features/cookies/components/useCookiesModalContent'
import { useCookiesContext } from 'features/cookies/CookiesContext'
import { acceptAllCookies, declineAllCookies } from 'features/cookies/cookiesPolicy'

interface Props {
  visible: boolean
  hideModal: () => void
}

export const CookiesConsent = ({ visible, hideModal }: Props) => {
  const { cookiesChoice, setCookiesChoice } = useCookiesContext()
  const [cookiesStep, setCookiesStep] = useState(CookiesSteps.COOKIES_CONSENT)

  const acceptAll = () => {
    setCookiesChoice({
      ...cookiesChoice,
      consent: acceptAllCookies,
    })
    hideModal()
  }

  const declineAll = () => {
    setCookiesChoice({
      ...cookiesChoice,
      consent: declineAllCookies,
    })
    hideModal()
  }

  const customChoice = () => {
    setCookiesChoice({
      ...cookiesChoice,
      consent: cookiesChoice.consent,
    })
    hideModal()
  }

  const { childrenProps } = useCookiesModalContent({
    cookiesStep,
    setCookiesStep,
    acceptAll,
    declineAll,
    customChoice,
  })

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
