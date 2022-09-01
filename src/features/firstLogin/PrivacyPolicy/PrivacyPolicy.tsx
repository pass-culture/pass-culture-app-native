import React, { useEffect, useState } from 'react'

import { useAppSettings } from 'features/auth/settings'
import { CookiesConsent } from 'features/cookies/pages/CookiesConsent'
import { useCookies } from 'features/cookies/useCookies'
import { PrivacyPolicyModal } from 'features/firstLogin/PrivacyPolicy/PrivacyPolicyModal'
import { analytics } from 'libs/firebase/analytics'
import { getCookiesConsent, setCookiesConsent } from 'libs/trackingConsent/consent'
import { requestIDFATrackingConsent } from 'libs/trackingConsent/useTrackingConsent'
import { useModal } from 'ui/components/modals/useModal'

export function PrivacyPolicy() {
  const { data: settings } = useAppSettings()
  const { cookiesConsent: hasUserMadeCookieChoiceV2 } = useCookies()
  const [hasUserMadeCookieChoiceV1, setHasUserMadeCookieChoiceV1] = useState(true)

  const { visible: cookiesConsentModalVisible, hideModal: hideCookiesConsentModal } = useModal(true)

  useEffect(() => {
    if (settings)
      getCookiesConsent().then((hasAcceptedCookie) => {
        if (hasAcceptedCookie === null) {
          setHasUserMadeCookieChoiceV1(false)
        }
      })
  }, [settings])

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

  const showCookiesModalV1 = hasUserMadeCookieChoiceV1 ? null : (
    <PrivacyPolicyModal
      visible={true}
      onApproval={acceptCookie}
      onRefusal={refuseCookie}
      disableBackdropTap
    />
  )

  const showCookiesModalV2 = hasUserMadeCookieChoiceV2 ? null : (
    <CookiesConsent visible={cookiesConsentModalVisible} hideModal={hideCookiesConsentModal} />
  )

  return settings?.appEnableCookiesV2 ? showCookiesModalV2 : showCookiesModalV1
}
