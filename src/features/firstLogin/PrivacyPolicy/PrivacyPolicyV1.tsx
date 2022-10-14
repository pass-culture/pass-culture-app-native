import React, { useEffect, useState } from 'react'

import { PrivacyPolicyModal } from 'features/firstLogin/PrivacyPolicy/PrivacyPolicyModal'
import { analytics } from 'libs/firebase/analytics'
import { getCookiesConsent, setCookiesConsent } from 'libs/trackingConsent/consent'
import { requestIDFATrackingConsent } from 'libs/trackingConsent/useTrackingConsent'

export function PrivacyPolicyV1() {
  const [hasUserMadeCookieChoiceV1, setHasUserMadeCookieChoiceV1] = useState(true)

  useEffect(() => {
    getCookiesConsent().then((hasAcceptedCookie) => {
      if (hasAcceptedCookie === null) {
        setHasUserMadeCookieChoiceV1(false)
      }
    })
  }, [])

  async function acceptCookie() {
    setHasUserMadeCookieChoiceV1(true)
    setCookiesConsent(true)
    await requestIDFATrackingConsent()
  }

  async function refuseCookie() {
    setHasUserMadeCookieChoiceV1(true)
    await setCookiesConsent(false)
    await analytics.logHasRefusedCookie()
    await analytics.disableCollection()
    await requestIDFATrackingConsent()
  }

  if (hasUserMadeCookieChoiceV1) return null

  return (
    <PrivacyPolicyModal
      visible
      onApproval={acceptCookie}
      onRefusal={refuseCookie}
      disableBackdropTap
    />
  )
}
