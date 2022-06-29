import React, { useEffect, useState } from 'react'

import { PrivacyPolicyModal } from 'features/firstLogin/PrivacyPolicy/PrivacyPolicyModal'
import { analytics } from 'libs/analytics'
import { storage } from 'libs/storage'
import { getCookiesConsent } from 'libs/trackingConsent/consent'
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
    storage.saveObject('has_accepted_cookie', true)
    await requestIDFATrackingConsent()
  }

  async function refuseCookie() {
    setHasUserMadeCookieChoice(true)
    await storage.saveObject('has_accepted_cookie', false)
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
