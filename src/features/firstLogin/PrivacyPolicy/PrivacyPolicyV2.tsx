import React, { useEffect, useState } from 'react'

import { isConsentChoiceExpired } from 'features/cookies/helpers/isConsentChoiceExpired'
import { useCookies } from 'features/cookies/helpers/useCookies'
import { CookiesConsent } from 'features/cookies/pages/CookiesConsent'
import { useModal } from 'ui/components/modals/useModal'

export function PrivacyPolicyV2() {
  const { cookiesConsent: hasUserMadeCookieChoiceV2 } = useCookies()
  const [hasConsentChoiceExpired, setHasConsentChoiceExpired] = useState(false)
  const { visible: cookiesConsentModalVisible, hideModal: hideCookiesConsentModal } = useModal(true)

  useEffect(() => {
    const checkConsentExpiration = async () => {
      setHasConsentChoiceExpired(await isConsentChoiceExpired())
    }

    checkConsentExpiration()
  }, [])

  if (hasUserMadeCookieChoiceV2 && !hasConsentChoiceExpired) return null

  return <CookiesConsent visible={cookiesConsentModalVisible} hideModal={hideCookiesConsentModal} />
}
