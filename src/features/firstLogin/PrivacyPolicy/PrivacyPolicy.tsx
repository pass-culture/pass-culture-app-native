import React, { useEffect, useState } from 'react'

import { PrivacyPolicyModal } from 'features/firstLogin/PrivacyPolicy/PrivacyPolicyModal'
import { analytics } from 'libs/analytics'
import { getCookiesConsent, setCookiesConsent } from 'libs/trackingConsent/consent'
import { requestIDFATrackingConsent } from 'libs/trackingConsent/useTrackingConsent'

export function PrivacyPolicy() {
  const [hasUserMadeCookieChoice, setHasUserMadeCookieChoice] = useState(true)

  useEffect(() => {
    getCookiesConsent().then((hasAcceptedCookie) => {
      if (hasAcceptedCookie === null) {
        setHasUserMadeCookieChoice(false)
      }
    })
  }, [])

  async function acceptCookie() {
    setHasUserMadeCookieChoice(true)
    setCookiesConsent(true)
    await requestIDFATrackingConsent()
  }

  async function refuseCookie() {
    setHasUserMadeCookieChoice(true)
    await setCookiesConsent(false)
    await analytics.logHasRefusedCookie()
    await analytics.disableCollection()
    await requestIDFATrackingConsent()
  }

  return hasUserMadeCookieChoice ? null : (
    <PrivacyPolicyModal
      visible={true}
      onApproval={acceptCookie}
      onRefusal={refuseCookie}
      disableBackdropTap
    />
  )
}
