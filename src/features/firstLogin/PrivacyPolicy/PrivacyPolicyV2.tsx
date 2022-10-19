import React, { useEffect } from 'react'

import { ConsentState } from 'features/cookies/enums'
import { useCookies } from 'features/cookies/helpers/useCookies'
import { useIsCookiesListUpToDate } from 'features/cookies/helpers/useIsCookiesListUpToDate'
import { CookiesConsent } from 'features/cookies/pages/CookiesConsent'
import { useModal } from 'ui/components/modals/useModal'

export function PrivacyPolicyV2() {
  const { cookiesConsent: hasUserMadeCookieChoiceV2 } = useCookies()
  const {
    visible: cookiesConsentModalVisible,
    hideModal: hideCookiesConsentModal,
    showModal: showCookiesConsentModal,
  } = useModal(false)
  const isCookiesListUpToDate = useIsCookiesListUpToDate()

  useEffect(() => {
    switch (hasUserMadeCookieChoiceV2.state) {
      case ConsentState.LOADING:
        break

      case ConsentState.UNKNOWN:
        showCookiesConsentModal()
        break

      default:
        if (isCookiesListUpToDate) {
          hideCookiesConsentModal()
        } else {
          showCookiesConsentModal()
        }
    }
  }, [
    hasUserMadeCookieChoiceV2,
    hideCookiesConsentModal,
    isCookiesListUpToDate,
    showCookiesConsentModal,
  ])

  return <CookiesConsent visible={cookiesConsentModalVisible} hideModal={hideCookiesConsentModal} />
}
